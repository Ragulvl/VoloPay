// ============================================================
// Core Types for Revenue Intelligence Inbox
// ============================================================

// --- Source data types (from JSON delivery) ---

export type SourceType = 'call' | 'meeting';

export interface CallPayload {
  id: string;
  external_call_id: string;
  workspace_slug: string;
  rep_email: string | null;
  rep_name: string | null;
  rep_user_id: string | null;
  direction: 'inbound' | 'outbound';
  direction_raw: string;
  from_number: string | null;
  to_number: string | null;
  started_at: string; // ISO timestamp
  duration_seconds: number;
  talk_time_seconds: number | null;
  speaker_count: number | null;
  segment_count: number | null;
  is_connected: boolean | null;
  is_conversation: boolean | null;
  observed_outcome: string | null;
  classification_reason: null;
  classification_status: string | null;
  is_campaign_call: boolean | null;
  first_dial_ever: boolean | null;
  first_connect_ever: boolean | null;
  prior_dials_ever: number | null;
  prior_connects_ever: number | null;
  summary: null;
  summary_status: string | null;
  transcript: string | null;
}

export interface MeetingPayload {
  id: string;
  title: string;
  starts_at: string; // ISO timestamp
  ends_at: string;
  duration_seconds: number;
  provider: string;
  join_url: string;
  organizer_email: string | null;
  attendee_count: number | null;
  recording_status: 'recorded' | 'cancelled' | 'not_scheduled';
  recording_detail: string | null;
  recording_id: string | null;
  has_transcript: boolean;
  has_video: boolean;
  summary: null;
  summary_status: string | null;
  redacted: boolean;
}

export interface TranscriptTurn {
  speaker: string;
  starts_at_seconds: number;
  timecode: string;
  text: string;
}

export interface TranscriptPayload {
  meeting_id: string;
  turns: TranscriptTurn[];
  unavailable_reason: string | null;
}

export interface DeliveryRecord {
  record_ref: string;
  source_type: SourceType;
  source_id: string;
  payload: CallPayload | MeetingPayload;
  transcript_payload: TranscriptPayload | null;
}

export interface DeliveryEnvelope {
  batch_id: string;
  revision: number;
  exported_at: string;
  records: DeliveryRecord[];
}

// --- Application state types ---

export type IntakeState =
  | 'has_text'          // Call with transcript or meeting with usable turns
  | 'awaiting_transcript' // Meeting M07 initially (has_transcript true, no turns)
  | 'recorded_no_speech'  // Recording exists but no turns (M05, M08, M11)
  | 'no_capture'          // Notetaker cancelled or not scheduled (M12, M13, M14)
  | 'no_text_supplied';   // Background calls (B01-B20)

export type Route =
  | 'Sales follow-up'
  | 'Partner/channel follow-up'
  | 'Sales coaching'
  | 'Account risk'
  | 'Product feedback'
  | 'Support/issue log'
  | 'Internal/vendor operations'
  | 'Needs review';

export type Confidence = 'supported' | 'tentative' | 'insufficient';
export type AnalysisFreshness = 'current' | 'pending_review' | 'stale';
export type ReviewState = 'reviewed' | 'pending' | 'flagged';

export interface EvidenceTag {
  tag: string;
  quote?: string;    // for calls: exact substring
  turnNumber?: number; // for meetings: 1-based
  sourceId: string;
  recordRef: string;
}

export interface RouteAssignment {
  route: Route;
  source: 'suggested' | 'manual';
  setAt: string; // ISO timestamp
  reason?: string;
}

export interface CuratedAnalysis {
  sourceId: string;
  sourceType: SourceType;
  writtenForRevision: number;
  confidence: Confidence;
  reason: string;
  evidenceTags: EvidenceTag[];
  routes: Route[];
  quotes: string[];          // exact substrings from source text
  unknowns: string[];
  nextAction: string;
  owner?: string;            // only when source states one
  flags?: string[];          // label conflicts, inferred statuses, etc.
  freshness: AnalysisFreshness;
}

export interface StoredRecord {
  // Identity
  source_type: SourceType;
  source_id: string;
  record_ref: string;

  // Applied revision
  applied_revision: number;
  applied_batch_id: string;

  // Source data (from latest revision)
  payload: CallPayload | MeetingPayload;
  transcript_payload: TranscriptPayload | null;

  // Computed
  intake_state: IntakeState;
  transcript_hash: string | null; // SHA-256 of transcript content, for staleness

  // Analysis (pre-generated + human-curated)
  analysis: CuratedAnalysis | null;

  // Routing
  routes: RouteAssignment[];

  // Override state
  manual_override: boolean; // true if any manual route exists

  // Timestamps
  first_imported_at: string;
  last_updated_at: string;

  // Change history
  change_history: ChangeEvent[];
}

export interface ChangeEvent {
  timestamp: string;
  type: 'imported' | 'updated' | 'route_added' | 'route_removed' | 'route_reset' | 'analysis_stale' | 'analysis_refreshed';
  description: string;
  revision?: number;
  batch_id?: string;
}

export interface ImportResult {
  batch_id: string;
  revision: number;
  inserted: number;
  updated: number;
  ignored: number;
  rejected: number;
  errors: string[];
  details: Array<{
    record_ref: string;
    source_id: string;
    action: 'inserted' | 'updated' | 'ignored' | 'rejected';
    reason?: string;
  }>;
}

// --- Dashboard types ---

export interface DashboardFilters {
  person?: string;        // rep_email for calls, organizer_email for meetings
  sourceType?: SourceType;
  route?: Route;
  reviewState?: ReviewState;
}

export interface DashboardMetrics {
  totalRecords: number;
  totalCalls: number;
  totalMeetings: number;
  usableTextCount: number;
  coveragePercent: number;
  routeAssignments: number; // can exceed unique records
  callRepActivity: RepActivity[];
  meetingOrganizerActivity: OrganizerActivity[];
  routeCounts: Record<Route, number>;
  intakeStateCounts: Record<IntakeState, number>;
  actionQueue: ActionQueueItem[];
}

export interface RepActivity {
  repName: string;
  repEmail: string;
  totalCalls: number;
  callsWithText: number;
  coveragePercent: number;
}

export interface OrganizerActivity {
  organizerEmail: string;
  totalMeetings: number;
  meetingsWithText: number;
  coveragePercent: number;
}

export interface ActionQueueItem {
  sourceId: string;
  sourceType: SourceType;
  recordRef: string;
  routes: Route[];
  priority: 'high' | 'medium' | 'low';
  reason: string;
  nextAction: string;
  confidence: Confidence;
  freshness: AnalysisFreshness;
}

// --- Export manifest types ---

export interface ManifestRecord {
  source_type: SourceType;
  source_id: string;
  record_ref: string;
  applied_revision: number;
  routes: Array<{
    route: Route;
    source: 'suggested' | 'manual';
  }>;
  output_paths: string[];
  superseded_paths: string[];
  intake_state: IntakeState;
  review_state: ReviewState;
  manual_override_flag: boolean;
  analysis_freshness: AnalysisFreshness;
}

export interface ExportManifest {
  generated_at: string;
  total_records: number;
  records: ManifestRecord[];
}

// --- App state ---

export interface AppState {
  records: StoredRecord[];
  lastImportResult: ImportResult | null;
  lastExportAt: string | null;
}
