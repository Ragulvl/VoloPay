// ============================================================
// Inbox View — Record list + Detail panel
// ============================================================

import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { StoredRecord, Route } from '../types';
import type { CallPayload, MeetingPayload, TranscriptPayload } from '../types';
import {
  RouteBadge,
  IntakeBadge,
  FreshnessBadge,
  ConfidenceBadge,
  SourceTypeBadge,
  RefPill,
  FlagWarning,
  EvidenceQuote,
  EmptyState,
  SectionCard,
} from '../components/shared';

const ALL_ROUTES: Route[] = [
  'Sales follow-up', 'Partner/channel follow-up', 'Sales coaching',
  'Account risk', 'Product feedback', 'Support/issue log',
  'Internal/vendor operations', 'Needs review',
];

function formatIST(isoStr: string): string {
  try {
    return new Date(isoStr).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return isoStr;
  }
}

function getTitle(record: StoredRecord): string {
  if (record.source_type === 'call') {
    const p = record.payload as CallPayload;
    return `${p.rep_name ?? p.rep_email ?? 'Unknown rep'} — ${p.observed_outcome ?? 'call'}`;
  }
  return (record.payload as MeetingPayload).title;
}

function getSubtitle(record: StoredRecord): string {
  if (record.source_type === 'call') {
    const p = record.payload as CallPayload;
    return `${formatIST(p.started_at)} · ${Math.round(p.duration_seconds / 60)}m · ${p.direction}`;
  }
  const p = record.payload as MeetingPayload;
  return `${formatIST(p.starts_at)} · ${p.recording_status}`;
}

// ---- Record Detail Panel ----
function RecordDetail({ record }: { record: StoredRecord }) {
  const { addRoute, removeRouteAction, resetRoutesAction } = useApp();
  const key = `${record.source_type}:${record.source_id}`;
  const [addingRoute, setAddingRoute] = useState(false);
  const [selectedNewRoute, setSelectedNewRoute] = useState<Route | ''>('');

  const existingRoutes = record.routes.map((r) => r.route);
  const availableRoutes = ALL_ROUTES.filter((r) => !existingRoutes.includes(r));

  const tp = record.transcript_payload as TranscriptPayload | null;
  const callText = record.source_type === 'call'
    ? (record.payload as CallPayload).transcript
    : null;
  const hasTranscript = callText || (tp?.turns && tp.turns.length > 0);

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <RefPill ref={record.record_ref} />
          <SourceTypeBadge type={record.source_type} />
          <IntakeBadge state={record.intake_state} />
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
          {getTitle(record)}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {getSubtitle(record)}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
          {record.analysis && <ConfidenceBadge confidence={record.analysis.confidence} />}
          {record.analysis && <FreshnessBadge freshness={record.analysis.freshness} />}
          <span className="revision-tag">rev {record.applied_revision}</span>
          {record.manual_override && (
            <span className="badge badge-manual">⚡ Manual override</span>
          )}
        </div>
      </div>

      <div className="detail-body">
        {/* Flags */}
        {record.analysis?.flags && record.analysis.flags.length > 0 && (
          <div className="detail-section">
            {record.analysis.flags.map((f, i) => (
              <FlagWarning key={i} message={f} />
            ))}
          </div>
        )}

        {/* Freshness warning */}
        {record.analysis?.freshness === 'pending_review' && (
          <FlagWarning message="Analysis is pending review — transcript content changed since analysis was written. Human review needed before treating analysis as current." />
        )}

        {/* Routes */}
        <div className="detail-section">
          <div className="detail-section-title">Routes</div>
          {record.routes.length === 0 ? (
            <div className="text-muted text-xs">No routes assigned</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {record.routes.map((ra) => (
                <div key={ra.route} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RouteBadge route={ra.route} />
                  <span className={`badge ${ra.source === 'manual' ? 'badge-manual' : 'badge-suggested'}`}>
                    {ra.source}
                  </span>
                  <button
                    className="btn btn-ghost btn-xs"
                    style={{ marginLeft: 'auto', color: '#dc2626' }}
                    onClick={() => removeRouteAction(key, ra.route)}
                    title="Remove this route"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 10, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            {addingRoute ? (
              <>
                <select
                  className="filter-select"
                  value={selectedNewRoute}
                  onChange={(e) => setSelectedNewRoute(e.target.value as Route)}
                >
                  <option value="">Select route…</option>
                  {availableRoutes.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={!selectedNewRoute}
                  onClick={() => {
                    if (selectedNewRoute) {
                      addRoute(key, selectedNewRoute as Route);
                      setAddingRoute(false);
                      setSelectedNewRoute('');
                    }
                  }}
                >
                  Add
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setAddingRoute(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-secondary btn-sm" onClick={() => setAddingRoute(true)}>
                + Add manual route
              </button>
            )}
            {record.manual_override && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => resetRoutesAction(key)}
                title="Remove all manual routes and restore suggested"
              >
                Reset to suggested
              </button>
            )}
          </div>
        </div>

        {/* Analysis */}
        {record.analysis && (
          <div className="detail-section">
            <div className="detail-section-title">Evidence-backed analysis</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {record.analysis.reason}
            </div>

            {record.analysis.evidenceTags.length > 0 && (
              <>
                <div className="detail-section-title" style={{ fontSize: 10, marginTop: 12 }}>Key evidence</div>
                {record.analysis.evidenceTags.map((tag, i) => {
                  const cite = tag.turnNumber
                    ? `${tag.recordRef} — turn ${tag.turnNumber}`
                    : tag.recordRef;
                  return (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                        <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', fontSize: 10 }}>
                          {tag.tag}
                        </span>
                        <span className="evidence-cite">{cite}</span>
                      </div>
                      {tag.quote && <EvidenceQuote quote={tag.quote} />}
                    </div>
                  );
                })}
              </>
            )}

            {record.analysis.unknowns.length > 0 && (
              <>
                <div className="detail-section-title" style={{ fontSize: 10, marginTop: 12 }}>Unknowns</div>
                {record.analysis.unknowns.map((u, i) => (
                  <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    • {u}
                  </div>
                ))}
              </>
            )}

            <div className="detail-section-title" style={{ fontSize: 10, marginTop: 12 }}>Next action</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--teal-700)', background: 'var(--teal-50)', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--teal-200)' }}>
              {record.analysis.nextAction}
            </div>
            {record.analysis.owner && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Owner (source-stated): <strong>{record.analysis.owner}</strong>
              </div>
            )}
          </div>
        )}

        {/* Transcript */}
        {hasTranscript && (
          <div className="detail-section">
            <div className="detail-section-title">Transcript</div>
            {callText ? (
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, maxHeight: 320, overflowY: 'auto', padding: '8px 0' }}>
                {callText}
              </div>
            ) : tp?.turns && tp.turns.length > 0 ? (
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {tp.turns.map((turn, i) => (
                  <div key={i} className="transcript-turn">
                    <div>
                      <div className="turn-timecode">{turn.timecode}</div>
                      <div className="turn-speaker">{turn.speaker}</div>
                    </div>
                    <div className="turn-body">
                      <div className="turn-text">{turn.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {/* No transcript */}
        {!hasTranscript && (
          <div className="detail-section">
            <div className="detail-section-title">Transcript</div>
            <IntakeBadge state={record.intake_state} />
            {tp?.unavailable_reason && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                Reason: {tp.unavailable_reason}
              </div>
            )}
          </div>
        )}

        {/* Source metadata */}
        <div className="detail-section">
          <div className="detail-section-title">Source metadata</div>
          <table style={{ fontSize: 11, width: '100%' }}>
            <tbody>
              <tr><td className="td-muted">source_id</td><td className="td-mono">{record.source_id}</td></tr>
              <tr><td className="td-muted">record_ref</td><td>{record.record_ref}</td></tr>
              <tr><td className="td-muted">revision</td><td>{record.applied_revision}</td></tr>
              <tr><td className="td-muted">batch</td><td className="td-mono">{record.applied_batch_id}</td></tr>
              {record.source_type === 'call' && (
                <>
                  <tr><td className="td-muted">is_connected</td><td>{String((record.payload as CallPayload).is_connected)}</td></tr>
                  <tr><td className="td-muted">is_conversation</td><td>{String((record.payload as CallPayload).is_conversation)}</td></tr>
                  <tr><td className="td-muted">observed_outcome</td><td>{(record.payload as CallPayload).observed_outcome ?? 'null'}</td></tr>
                </>
              )}
              {record.source_type === 'meeting' && (
                <>
                  <tr><td className="td-muted">recording_status</td><td>{(record.payload as MeetingPayload).recording_status}</td></tr>
                  <tr><td className="td-muted">has_transcript</td><td>{String((record.payload as MeetingPayload).has_transcript)}</td></tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Change history */}
        <div className="detail-section">
          <div className="detail-section-title">Change history</div>
          {record.change_history.map((evt, i) => (
            <div key={i} className="change-item">
              <div className="change-time">{formatIST(evt.timestamp)}</div>
              <div className="change-desc">{evt.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Inbox List ----
export function Inbox() {
  const { state, selectRecord } = useApp();
  const { records, filters, selectedRecordId } = state;

  const [localFilters, setLocalFilters] = useState({
    sourceType: '',
    route: '',
    intakeState: '',
    searchText: '',
  });

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (localFilters.sourceType && r.source_type !== localFilters.sourceType) return false;
      if (localFilters.route) {
        if (!r.routes.some((ra) => ra.route === localFilters.route)) return false;
      }
      if (localFilters.intakeState && r.intake_state !== localFilters.intakeState) return false;
      if (localFilters.searchText) {
        const q = localFilters.searchText.toLowerCase();
        const title = getTitle(r).toLowerCase();
        const ref = r.record_ref.toLowerCase();
        const sid = r.source_id.toLowerCase();
        if (!title.includes(q) && !ref.includes(q) && !sid.includes(q)) return false;
      }
      return true;
    });
  }, [records, localFilters]);

  const selectedRecord = selectedRecordId
    ? records.find((r) => `${r.source_type}:${r.source_id}` === selectedRecordId)
    : null;

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Filter bar */}
        <div className="filter-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Search records…"
            value={localFilters.searchText}
            onChange={(e) => setLocalFilters((f) => ({ ...f, searchText: e.target.value }))}
          />
          <select
            className="filter-select"
            value={localFilters.sourceType}
            onChange={(e) => setLocalFilters((f) => ({ ...f, sourceType: e.target.value }))}
          >
            <option value="">All types</option>
            <option value="call">Calls</option>
            <option value="meeting">Meetings</option>
          </select>
          <select
            className="filter-select"
            value={localFilters.route}
            onChange={(e) => setLocalFilters((f) => ({ ...f, route: e.target.value }))}
          >
            <option value="">All routes</option>
            {ALL_ROUTES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            className="filter-select"
            value={localFilters.intakeState}
            onChange={(e) => setLocalFilters((f) => ({ ...f, intakeState: e.target.value }))}
          >
            <option value="">All states</option>
            <option value="has_text">Has text</option>
            <option value="awaiting_transcript">Awaiting transcript</option>
            <option value="recorded_no_speech">Recorded — no speech</option>
            <option value="no_capture">No capture</option>
            <option value="no_text_supplied">No text supplied</option>
          </select>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
            {filtered.length} / {records.length}
          </span>
        </div>

        {/* Record list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length === 0 ? (
            <EmptyState
              title={records.length === 0 ? 'No records imported' : 'No records match filters'}
              description={records.length === 0 ? 'Import data/01_initial.json to start' : 'Clear filters to see all records'}
            />
          ) : (
            filtered.map((record) => {
              const key = `${record.source_type}:${record.source_id}`;
              return (
                <div
                  key={key}
                  className={`record-list-item ${selectedRecordId === key ? 'selected' : ''}`}
                  onClick={() => selectRecord(key)}
                >
                  <RefPill ref={record.record_ref} />
                  <div className="record-list-main">
                    <div className="record-list-title">{getTitle(record)}</div>
                    <div className="record-list-meta">
                      <span>{getSubtitle(record)}</span>
                      <IntakeBadge state={record.intake_state} />
                      {record.analysis && <ConfidenceBadge confidence={record.analysis.confidence} />}
                      {record.analysis?.freshness !== 'current' && record.analysis && (
                        <FreshnessBadge freshness={record.analysis.freshness} />
                      )}
                      {record.manual_override && (
                        <span className="badge badge-manual" style={{ fontSize: 9 }}>⚡ Manual</span>
                      )}
                    </div>
                    <div className="record-list-routes">
                      {record.routes.map((ra) => (
                        <RouteBadge key={ra.route} route={ra.route} small />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selectedRecord && <RecordDetail record={selectedRecord} />}
    </div>
  );
}
