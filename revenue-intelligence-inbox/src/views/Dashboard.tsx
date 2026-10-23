// ============================================================
// Dashboard View
// Shows: metrics, coverage, activity by person, route counts, action queue
// ============================================================

import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { StoredRecord, Route } from '../types';
import type { CallPayload, MeetingPayload } from '../types';
import {
  MetricCard,
  RouteBadge,
  IntakeBadge,
  FreshnessBadge,
  BarChart,
  SectionCard,
  EmptyState,
  ConfidenceBadge,
  ProgressBar,
} from '../components/shared';

const ALL_ROUTES: Route[] = [
  'Sales follow-up',
  'Partner/channel follow-up',
  'Sales coaching',
  'Account risk',
  'Product feedback',
  'Support/issue log',
  'Internal/vendor operations',
  'Needs review',
];

export function Dashboard({ onSelectRecord }: { onSelectRecord: (key: string) => void }) {
  const { state, setFilter } = useApp();
  const { records, filters } = state;

  // Apply person filter (both reps and organizers)
  const filtered = useMemo(() => {
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
      return true;
    });
  }, [records, filters]);

  // Metrics
  const calls = filtered.filter((r) => r.source_type === 'call');
  const meetings = filtered.filter((r) => r.source_type === 'meeting');
  const withText = filtered.filter((r) => r.intake_state === 'has_text');
  const totalRouteAssignments = filtered.reduce((acc, r) => acc + r.routes.length, 0);
  const coveragePct = filtered.length > 0
    ? Math.round((withText.length / filtered.length) * 100)
    : 0;

  // Source-reported connection rate (calls only)
  const callsWithConnectedKnown = calls.filter(
    (r) => (r.payload as CallPayload).is_connected !== null
  );
  const connectedCount = calls.filter(
    (r) => (r.payload as CallPayload).is_connected === true
  ).length;
  const connectionRate = callsWithConnectedKnown.length > 0
    ? Math.round((connectedCount / callsWithConnectedKnown.length) * 100)
    : 0;

  // Call-rep activity (separate from meeting organizer activity)
  const repMap = new Map<string, { name: string; total: number; withText: number }>();
  for (const r of calls) {
    const p = r.payload as CallPayload;
    const email = p.rep_email ?? 'unknown';
    const existing = repMap.get(email) ?? { name: p.rep_name ?? email, total: 0, withText: 0 };
    existing.total++;
    if (r.intake_state === 'has_text') existing.withText++;
    repMap.set(email, existing);
  }

  // Meeting organizer activity
  const orgMap = new Map<string, { email: string; total: number; withText: number }>();
  for (const r of meetings) {
    const p = r.payload as MeetingPayload;
    const email = p.organizer_email ?? 'unknown';
    const existing = orgMap.get(email) ?? { email, total: 0, withText: 0 };
    existing.total++;
    if (r.intake_state === 'has_text') existing.withText++;
    orgMap.set(email, existing);
  }

  // Route counts
  const routeCounts: Record<string, number> = {};
  for (const r of filtered) {
    for (const ra of r.routes) {
      routeCounts[ra.route] = (routeCounts[ra.route] ?? 0) + 1;
    }
  }

  // Intake state counts
  const intakeCounts: Record<string, number> = {};
  for (const r of filtered) {
    intakeCounts[r.intake_state] = (intakeCounts[r.intake_state] ?? 0) + 1;
  }

  // Action queue: records with analysis, sorted by priority
  const actionQueue = filtered
    .filter((r) => r.analysis && r.intake_state === 'has_text')
    .map((r) => {
      const conf = r.analysis!.confidence;
      const fresh = r.analysis!.freshness;
      const isRisk = r.routes.some((ra) => ['Account risk', 'Support/issue log'].includes(ra.route));
      const priority = isRisk ? 'high' : conf === 'supported' ? 'medium' : 'low';
      return { record: r, priority, fresh };
    })
    .sort((a, b) => {
      const pOrder = { high: 0, medium: 1, low: 2 };
      return pOrder[a.priority] - pOrder[b.priority];
    })
    .slice(0, 10);

  // People list for filter
  const allPeople = useMemo(() => {
    const reps = new Map<string, string>();
    const orgs = new Map<string, string>();
    for (const r of records) {
      if (r.source_type === 'call') {
        const p = r.payload as CallPayload;
        if (p.rep_email) reps.set(p.rep_email, p.rep_name ?? p.rep_email);
      } else {
        const p = r.payload as MeetingPayload;
        if (p.organizer_email) orgs.set(p.organizer_email, p.organizer_email);
      }
    }
    return { reps, orgs };
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="page-body">
        <EmptyState
          title="No records imported yet"
          description="Use the Import panel to load the initial batch (data/01_initial.json)"
        />
      </div>
    );
  }

  return (
    <>
      {/* Filter bar */}
      <div className="filter-bar">
        <span className="filter-label">Filter:</span>

        <select
          className="filter-select"
          value={filters.sourceType ?? ''}
          onChange={(e) => setFilter({ sourceType: (e.target.value as 'call' | 'meeting') || undefined })}
        >
          <option value="">All types</option>
          <option value="call">Calls</option>
          <option value="meeting">Meetings</option>
        </select>

        <select
          className="filter-select"
          value={filters.person ?? ''}
          onChange={(e) => setFilter({ person: e.target.value || undefined })}
        >
          <option value="">All people</option>
          <optgroup label="Call reps">
            {Array.from(allPeople.reps.entries()).map(([email, name]) => (
              <option key={email} value={email}>{name} (rep)</option>
            ))}
          </optgroup>
          <optgroup label="Meeting organizers">
            {Array.from(allPeople.orgs.entries()).map(([email]) => (
              <option key={email} value={email}>{email} (org)</option>
            ))}
          </optgroup>
        </select>

        {(filters.person || filters.sourceType) && (
          <button className="btn btn-ghost btn-sm" onClick={() => setFilter({ person: undefined, sourceType: undefined })}>
            Clear filters
          </button>
        )}

        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>
          Showing {filtered.length} of {records.length} records — selected records, not representative team performance
        </span>
      </div>

      <div className="page-body">
        {/* Key metrics */}
        <div className="metrics-grid">
          <MetricCard
            value={filtered.length}
            label="Records"
            definition={`Calls: ${calls.length}, Meetings: ${meetings.length}`}
          />
          <MetricCard
            value={withText.length}
            label="With usable text"
            definition={`Coverage: ${withText.length}/${filtered.length} = ${coveragePct}%`}
            variant="accent"
          />
          <MetricCard
            value={`${coveragePct}%`}
            label="Text coverage"
            definition="Usable texts / selected records in current filter"
            variant="accent"
          />
          <MetricCard
            value={totalRouteAssignments}
            label="Route assignments"
            definition={`Across ${filtered.length} records — can exceed record count (multi-route)`}
          />
          <MetricCard
            value={`${connectionRate}%`}
            label="Source-reported connection"
            definition={`${connectedCount}/${callsWithConnectedKnown.length} calls with known is_connected. Stored label only.`}
            sub={callsWithConnectedKnown.length < calls.length ? `(${calls.length - callsWithConnectedKnown.length} unknown)` : undefined}
          />
        </div>

        <div className="two-col-grid">
          {/* Call rep activity */}
          <SectionCard
            title="Call-rep activity"
            action={<span className="text-xs text-muted">Per rep_email</span>}
          >
            {repMap.size === 0 ? (
              <EmptyState title="No calls in filter" />
            ) : (
              <>
                <table style={{ fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th>Rep</th>
                      <th>Calls</th>
                      <th>With text</th>
                      <th>Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(repMap.entries()).map(([email, data]) => (
                      <tr key={email} style={{ cursor: 'pointer' }}
                        onClick={() => setFilter({ person: email, sourceType: 'call' })}>
                        <td>
                          <div style={{ fontWeight: 500 }}>{data.name}</div>
                          <div className="td-muted">{email}</div>
                        </td>
                        <td>{data.total}</td>
                        <td>{data.withText}</td>
                        <td>
                          <div>{data.withText}/{data.total}</div>
                          <ProgressBar value={data.withText} max={data.total} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="card-definition" style={{ marginTop: 8 }}>
                  Coverage shows calls with transcript text ÷ total calls. Sample is selected, not representative performance ranking.
                  {Array.from(repMap.entries()).some(([, d]) => d.withText === 0) && (
                    <span style={{ color: 'var(--badge-flag-text)' }}> Note: 0/N coverage reflects dataset selection, not performance.</span>
                  )}
                </div>
              </>
            )}
          </SectionCard>

          {/* Meeting organizer activity */}
          <SectionCard
            title="Meeting-organizer activity"
            action={<span className="text-xs text-muted">Per organizer_email</span>}
          >
            {orgMap.size === 0 ? (
              <EmptyState title="No meetings in filter" />
            ) : (
              <>
                <table style={{ fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th>Organizer</th>
                      <th>Meetings</th>
                      <th>With text</th>
                      <th>Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(orgMap.entries()).map(([email, data]) => (
                      <tr key={email} style={{ cursor: 'pointer' }}
                        onClick={() => setFilter({ person: email, sourceType: 'meeting' })}>
                        <td>
                          <div style={{ fontWeight: 500, fontSize: 12 }}>{email}</div>
                        </td>
                        <td>{data.total}</td>
                        <td>{data.withText}</td>
                        <td>
                          <div>{data.withText}/{data.total}</div>
                          <ProgressBar value={data.withText} max={data.total} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="card-definition" style={{ marginTop: 8 }}>
                  Call reps and meeting organizers are separate roles. An organizer is not automatically the salesperson or an attendee.
                  {Array.from(orgMap.entries()).some(([e]) => e === 'arun@example.com') && (
                    <span style={{ color: 'var(--badge-flag-text)' }}> M12 organizer email matches rep Arun — different roles; not merged.</span>
                  )}
                </div>
              </>
            )}
          </SectionCard>
        </div>

        <div className="two-col-grid">
          {/* Route distribution */}
          <SectionCard title="Route distribution">
            <BarChart
              items={ALL_ROUTES.map((r) => ({
                label: r,
                value: routeCounts[r] ?? 0,
              })).filter((i) => i.value > 0)}
              maxValue={Math.max(...Object.values(routeCounts), 1)}
            />
            <div className="card-definition" style={{ marginTop: 8 }}>
              Route assignments ({totalRouteAssignments}) may exceed records ({filtered.length}) — conversations can have multiple routes.
            </div>
          </SectionCard>

          {/* Intake states */}
          <SectionCard title="Record intake states">
            <BarChart
              items={[
                { label: 'Has text', value: intakeCounts['has_text'] ?? 0, color: '#14b8a6' },
                { label: 'Awaiting transcript', value: intakeCounts['awaiting_transcript'] ?? 0, color: '#f59e0b' },
                { label: 'Recorded — no speech', value: intakeCounts['recorded_no_speech'] ?? 0, color: '#818cf8' },
                { label: 'No capture', value: intakeCounts['no_capture'] ?? 0, color: '#f87171' },
                { label: 'No text supplied', value: intakeCounts['no_text_supplied'] ?? 0, color: '#94a3b8' },
              ]}
            />
            <div className="card-definition" style={{ marginTop: 8 }}>
              A missing transcript does not establish that a conversation was unimportant. Intake state ≠ business outcome.
            </div>
          </SectionCard>
        </div>

        {/* Action queue */}
        <SectionCard
          title="Prioritised action queue"
          action={<span className="text-xs text-muted">Records with analysis · reason-backed</span>}
        >
          {actionQueue.length === 0 ? (
            <EmptyState title="No actionable items" description="Import data to populate the action queue" />
          ) : (
            <div>
              {actionQueue.map(({ record, priority }) => {
                const key = `${record.source_type}:${record.source_id}`;
                return (
                  <div
                    key={key}
                    className="action-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectRecord(key)}
                  >
                    <div className={`action-priority-dot priority-${priority}`} style={{ marginTop: 4 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className="record-ref-pill">{record.record_ref}</span>
                        <span style={{ fontSize: 12, fontWeight: 500 }}>
                          {record.source_type === 'call'
                            ? `${(record.payload as CallPayload).rep_name ?? 'Unknown rep'}`
                            : `${(record.payload as MeetingPayload).title}`}
                        </span>
                        <span style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                          {record.analysis && <ConfidenceBadge confidence={record.analysis.confidence} />}
                          {record.analysis && <FreshnessBadge freshness={record.analysis.freshness} />}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
                        {record.routes.map((ra) => <RouteBadge key={ra.route} route={ra.route} small />)}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {record.analysis?.nextAction}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
}
