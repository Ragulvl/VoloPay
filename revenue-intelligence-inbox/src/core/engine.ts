// ============================================================
// Core Engine: Import, Identity, Revision Management, Staleness
// All business logic - no UI dependencies
// ============================================================

import type {
  DeliveryEnvelope,
  DeliveryRecord,
  StoredRecord,
  IntakeState,
  Route,
  RouteAssignment,
  ImportResult,
  CuratedAnalysis,
  AnalysisFreshness,
  TranscriptPayload,
  CallPayload,
  MeetingPayload,
  ChangeEvent,
} from '../types';

import { CURATED_ANALYSES } from './curatedAnalysis';

// ---- Hash utility ----
export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Synchronous hash for transcript content (used for staleness detection)
export function simpleHash(text: string): string {
  // FNV-1a 32-bit hash - fast and sufficient for staleness detection
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

// Extract transcript text content for hashing
export function extractTranscriptContent(record: DeliveryRecord): string | null {
  if (record.source_type === 'call') {
    const payload = record.payload as CallPayload;
    return payload.transcript ?? null;
  } else {
    const tp = record.transcript_payload as TranscriptPayload | null;
    if (!tp || !tp.turns || tp.turns.length === 0) return null;
    return tp.turns.map((t) => `${t.speaker}:${t.text}`).join('\n');
  }
}

// ---- Intake state computation ----
export function computeIntakeState(record: DeliveryRecord): IntakeState {
  if (record.source_type === 'call') {
    const payload = record.payload as CallPayload;
    if (payload.transcript && payload.transcript.trim().length > 0) {
      return 'has_text';
    }
    return 'no_text_supplied';
  } else {
    // Meeting
    const payload = record.payload as MeetingPayload;
    const tp = record.transcript_payload as TranscriptPayload | null;

    if (payload.recording_status === 'cancelled') {
      return 'no_capture';
    }
    if (payload.recording_status === 'not_scheduled') {
      return 'no_capture';
    }
    // recording_status === 'recorded'
    if (!payload.has_transcript) {
      return 'no_text_supplied';
    }
    // has_transcript true
    if (!tp || !tp.turns) {
      return 'awaiting_transcript';
    }
    if (tp.turns.length === 0) {
      if (tp.unavailable_reason) {
        // Staged: has_transcript true, turns=[], with reason
        return 'awaiting_transcript';
      }
      // Recorded but nobody spoke
      return 'recorded_no_speech';
    }
    // Has turns with content
    const hasText = tp.turns.some((t) => t.text && t.text.trim().length > 0);
    return hasText ? 'has_text' : 'recorded_no_speech';
  }
}

// ---- Route computation from curated analysis ----
export function buildSuggestedRoutes(
  sourceId: string,
  sourceType: string,
  analysis: CuratedAnalysis | null,
  timestamp: string
): RouteAssignment[] {
  if (!analysis) return [];
  return analysis.routes.map((route) => ({
    route,
    source: 'suggested' as const,
    setAt: timestamp,
    reason: analysis.reason,
  }));
}

// ---- Upsert logic: core of import rules ----
// Returns: action taken and whether transcript changed
function upsertRecord(
  existing: StoredRecord | undefined,
  incoming: DeliveryRecord,
  revision: number,
  batchId: string,
  now: string
): { record: StoredRecord; action: 'inserted' | 'updated' | 'ignored' } {
  const key = `${incoming.source_type}:${incoming.source_id}`;
  void key;

  // Rule 2: Same or older revision is ignored
  if (existing && existing.applied_revision >= revision) {
    return { record: existing, action: 'ignored' };
  }

  // Compute transcript hash for incoming record
  const transcriptContent = extractTranscriptContent(incoming);
  const newHash = transcriptContent ? simpleHash(transcriptContent) : null;

  const intakeState = computeIntakeState(incoming);

  // Get curated analysis for this record
  const curatedKey = `${incoming.source_type}:${incoming.source_id}`;
  const analysis = CURATED_ANALYSES[curatedKey] ?? null;

  // Determine analysis freshness
  let freshness: AnalysisFreshness = 'current';
  if (!analysis) {
    freshness = 'current'; // no analysis = no staleness
  }

  if (!existing) {
    // Insert new record
    const suggestedRoutes = buildSuggestedRoutes(
      incoming.source_id,
      incoming.source_type,
      analysis,
      now
    );

    const newRecord: StoredRecord = {
      source_type: incoming.source_type,
      source_id: incoming.source_id,
      record_ref: incoming.record_ref,
      applied_revision: revision,
      applied_batch_id: batchId,
      payload: incoming.payload,
      transcript_payload: incoming.transcript_payload,
      intake_state: intakeState,
      transcript_hash: newHash,
      analysis: analysis ? { ...analysis, freshness: 'current' } : null,
      routes: suggestedRoutes,
      manual_override: false,
      first_imported_at: now,
      last_updated_at: now,
      change_history: [
        {
          timestamp: now,
          type: 'imported',
          description: `Imported from batch ${batchId}, revision ${revision}`,
          revision,
          batch_id: batchId,
        },
      ],
    };
    return { record: newRecord, action: 'inserted' };
  }

  // Update existing record
  const oldHash = existing.transcript_hash;
  const transcriptChanged = newHash !== oldHash;

  // Check analysis freshness after update
  if (analysis && transcriptChanged) {
    freshness = 'pending_review';
  }

  // Preserve manual routes; replace suggested routes
  const manualRoutes = existing.routes.filter((r) => r.source === 'manual');
  const newSuggestedRoutes = buildSuggestedRoutes(
    incoming.source_id,
    incoming.source_type,
    analysis,
    now
  );

  const changeHistory: ChangeEvent[] = [...existing.change_history];
  changeHistory.push({
    timestamp: now,
    type: 'updated',
    description: `Updated from batch ${batchId}, revision ${revision}`,
    revision,
    batch_id: batchId,
  });

  if (transcriptChanged && analysis) {
    changeHistory.push({
      timestamp: now,
      type: 'analysis_stale',
      description: 'Transcript content changed; analysis marked pending review',
    });
  }

  // For analysis: if transcript changed, mark pending review
  // But don't lose the existing analysis - just update freshness
  let updatedAnalysis = existing.analysis;
  if (analysis) {
    // Use the latest curated analysis with updated freshness
    updatedAnalysis = { ...analysis, freshness };
  }

  const updatedRecord: StoredRecord = {
    ...existing,
    applied_revision: revision,
    applied_batch_id: batchId,
    payload: incoming.payload,
    transcript_payload: incoming.transcript_payload,
    intake_state: intakeState,
    transcript_hash: newHash,
    analysis: updatedAnalysis,
    routes: [...manualRoutes, ...newSuggestedRoutes],
    manual_override: manualRoutes.length > 0,
    last_updated_at: now,
    change_history: changeHistory,
  };

  return { record: updatedRecord, action: 'updated' };
}

// ---- Main import function ----
export function importBatch(
  envelope: DeliveryEnvelope,
  existingRecords: StoredRecord[],
  now: string = new Date().toISOString()
): { records: StoredRecord[]; result: ImportResult } {
  const result: ImportResult = {
    batch_id: envelope.batch_id,
    revision: envelope.revision,
    inserted: 0,
    updated: 0,
    ignored: 0,
    rejected: 0,
    errors: [],
    details: [],
  };

  // Build lookup map by identity key
  const recordMap = new Map<string, StoredRecord>();
  for (const r of existingRecords) {
    recordMap.set(`${r.source_type}:${r.source_id}`, r);
  }

  const processedKeys = new Set<string>();

  for (const incoming of envelope.records) {
    // Validation
    if (!incoming.source_type || !incoming.source_id) {
      result.rejected++;
      result.errors.push(
        `Record ${incoming.record_ref}: missing source_type or source_id`
      );
      result.details.push({
        record_ref: incoming.record_ref || '?',
        source_id: incoming.source_id || '?',
        action: 'rejected',
        reason: 'Missing source_type or source_id',
      });
      continue;
    }

    if (incoming.source_type !== 'call' && incoming.source_type !== 'meeting') {
      result.rejected++;
      result.errors.push(
        `Record ${incoming.record_ref}: invalid source_type "${incoming.source_type}"`
      );
      result.details.push({
        record_ref: incoming.record_ref,
        source_id: incoming.source_id,
        action: 'rejected',
        reason: `Invalid source_type: ${incoming.source_type}`,
      });
      continue;
    }

    const key = `${incoming.source_type}:${incoming.source_id}`;

    // Detect duplicate keys within same batch (shouldn't happen but guard it)
    if (processedKeys.has(key)) {
      result.rejected++;
      result.errors.push(
        `Record ${incoming.record_ref}: duplicate identity key in batch`
      );
      result.details.push({
        record_ref: incoming.record_ref,
        source_id: incoming.source_id,
        action: 'rejected',
        reason: 'Duplicate identity key in batch',
      });
      continue;
    }
    processedKeys.add(key);

    const existing = recordMap.get(key);
    const { record, action } = upsertRecord(
      existing,
      incoming,
      envelope.revision,
      envelope.batch_id,
      now
    );

    recordMap.set(key, record);
    result[action]++;
    result.details.push({
      record_ref: incoming.record_ref,
      source_id: incoming.source_id,
      action,
    });
  }

  // Return updated records list (order-stable)
  const updatedRecords: StoredRecord[] = [];
  const seenKeys = new Set<string>();

  // Keep existing records that weren't in this batch
  for (const r of existingRecords) {
    const key = `${r.source_type}:${r.source_id}`;
    if (!processedKeys.has(key)) {
      updatedRecords.push(r);
      seenKeys.add(key);
    }
  }

  // Add all processed records
  for (const [key, record] of recordMap) {
    if (processedKeys.has(key) && !seenKeys.has(key)) {
      updatedRecords.push(record);
      seenKeys.add(key);
    } else if (processedKeys.has(key)) {
      // Already handled above (from existing), update it
    }
  }

  // Actually build final list properly
  const finalMap = new Map<string, StoredRecord>();
  for (const r of existingRecords) {
    finalMap.set(`${r.source_type}:${r.source_id}`, r);
  }
  for (const [key, record] of recordMap) {
    if (processedKeys.has(key)) {
      finalMap.set(key, record);
    }
  }

  return {
    records: Array.from(finalMap.values()),
    result,
  };
}

// ---- Route management ----
export function addManualRoute(
  record: StoredRecord,
  route: Route,
  now: string = new Date().toISOString()
): StoredRecord {
  // Remove any existing route assignment for this route
  const filteredRoutes = record.routes.filter((r) => r.route !== route);
  const newRoute: RouteAssignment = {
    route,
    source: 'manual',
    setAt: now,
  };

  return {
    ...record,
    routes: [...filteredRoutes, newRoute],
    manual_override: true,
    last_updated_at: now,
    change_history: [
      ...record.change_history,
      {
        timestamp: now,
        type: 'route_added',
        description: `Manual route added: ${route}`,
      },
    ],
  };
}

export function removeRoute(
  record: StoredRecord,
  route: Route,
  now: string = new Date().toISOString()
): StoredRecord {
  const filteredRoutes = record.routes.filter((r) => r.route !== route);
  const hasManual = filteredRoutes.some((r) => r.source === 'manual');

  return {
    ...record,
    routes: filteredRoutes,
    manual_override: hasManual,
    last_updated_at: now,
    change_history: [
      ...record.change_history,
      {
        timestamp: now,
        type: 'route_removed',
        description: `Route removed: ${route}`,
      },
    ],
  };
}

export function resetRoutes(
  record: StoredRecord,
  now: string = new Date().toISOString()
): StoredRecord {
  // Remove all manual routes; keep suggested
  const suggestedRoutes = record.routes.filter((r) => r.source === 'suggested');

  return {
    ...record,
    routes: suggestedRoutes,
    manual_override: false,
    last_updated_at: now,
    change_history: [
      ...record.change_history,
      {
        timestamp: now,
        type: 'route_reset',
        description: 'Manual routes reset; suggested routes restored',
      },
    ],
  };
}

// ---- Staleness helpers ----
export function isAnalysisCurrent(record: StoredRecord): boolean {
  return (
    record.analysis === null ||
    record.analysis.freshness === 'current'
  );
}

export function getAnalysisFreshness(record: StoredRecord): AnalysisFreshness {
  if (!record.analysis) return 'current';
  return record.analysis.freshness;
}

// ---- Usable text check ----
export function hasUsableText(record: StoredRecord): boolean {
  return record.intake_state === 'has_text';
}

// ---- Filter helpers ----
export function filterRecords(
  records: StoredRecord[],
  filters: {
    person?: string;
    sourceType?: string;
    route?: Route;
    intakeState?: IntakeState;
  }
): StoredRecord[] {
  return records.filter((r) => {
    if (filters.sourceType && r.source_type !== filters.sourceType) return false;

    if (filters.person) {
      if (r.source_type === 'call') {
        const p = r.payload as CallPayload;
        if (p.rep_email !== filters.person) return false;
      } else {
        const p = r.payload as MeetingPayload;
        if (p.organizer_email !== filters.person) return false;
      }
    }

    if (filters.route) {
      const hasRoute = r.routes.some((ra) => ra.route === filters.route);
      if (!hasRoute) return false;
    }

    if (filters.intakeState && r.intake_state !== filters.intakeState) {
      return false;
    }

    return true;
  });
}

// ---- Timestamp helpers ----
// IST offset: +05:30 = 330 minutes
export function toIST(isoTimestamp: string): Date {
  const d = new Date(isoTimestamp);
  return new Date(d.getTime() + 330 * 60 * 1000);
}

export function getActivityDate(record: StoredRecord): string {
  let ts: string;
  if (record.source_type === 'call') {
    ts = (record.payload as CallPayload).started_at;
  } else {
    ts = (record.payload as MeetingPayload).starts_at;
  }
  const ist = toIST(ts);
  return ist.toISOString().substring(0, 10);
}

export function getRepOrOrganizer(record: StoredRecord): string | null {
  if (record.source_type === 'call') {
    return (record.payload as CallPayload).rep_email;
  } else {
    return (record.payload as MeetingPayload).organizer_email;
  }
}

// ---- Source-reported connection rate ----
export function computeConnectionRate(records: StoredRecord[]): {
  connected: number;
  total: number;
  unknown: number;
  rate: number;
} {
  const calls = records.filter((r) => r.source_type === 'call');
  const connected = calls.filter(
    (r) => (r.payload as CallPayload).is_connected === true
  ).length;
  const unknown = calls.filter(
    (r) => (r.payload as CallPayload).is_connected === null
  ).length;
  const total = calls.filter(
    (r) => (r.payload as CallPayload).is_connected !== null
  ).length;
  return {
    connected,
    total,
    unknown,
    rate: total > 0 ? connected / total : 0,
  };
}
