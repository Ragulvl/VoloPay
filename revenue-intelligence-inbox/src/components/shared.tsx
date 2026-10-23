// ============================================================
// Shared UI Components
// ============================================================

import React from 'react';
import type { Route, IntakeState, Confidence, AnalysisFreshness } from '../types';

// ---- Route Badge ----
export const ROUTE_CLASSES: Record<Route, string> = {
  'Sales follow-up': 'route-sales',
  'Partner/channel follow-up': 'route-partner',
  'Sales coaching': 'route-coaching',
  'Account risk': 'route-risk',
  'Product feedback': 'route-product',
  'Support/issue log': 'route-support',
  'Internal/vendor operations': 'route-internal',
  'Needs review': 'route-review',
};

export function RouteBadge({ route, small }: { route: Route; small?: boolean }) {
  const cls = ROUTE_CLASSES[route] ?? 'route-review';
  return (
    <span className={`badge badge-route ${cls}`} style={small ? { fontSize: 10, padding: '1px 6px' } : {}}>
      {route}
    </span>
  );
}

// ---- Intake State Badge ----
const INTAKE_LABELS: Record<IntakeState, string> = {
  has_text: 'Has text',
  awaiting_transcript: 'Awaiting transcript',
  recorded_no_speech: 'Recorded — no speech',
  no_capture: 'No capture',
  no_text_supplied: 'No text supplied',
};

export function IntakeBadge({ state }: { state: IntakeState }) {
  return (
    <span className={`badge state-${state}`}>
      {INTAKE_LABELS[state]}
    </span>
  );
}

// ---- Confidence Badge ----
export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  return (
    <span className={`badge badge-${confidence}`}>
      {confidence}
    </span>
  );
}

// ---- Freshness Badge ----
const FRESHNESS_LABELS: Record<AnalysisFreshness, string> = {
  current: 'Analysis current',
  pending_review: 'Pending review',
  stale: 'Stale',
};

export function FreshnessBadge({ freshness }: { freshness: AnalysisFreshness }) {
  const cls = freshness === 'current' ? 'badge-current' : freshness === 'pending_review' ? 'badge-pending' : 'badge-stale';
  return (
    <span className={`badge ${cls}`}>
      {FRESHNESS_LABELS[freshness]}
    </span>
  );
}

// ---- Source Type Badge ----
export function SourceTypeBadge({ type }: { type: 'call' | 'meeting' }) {
  return (
    <span className="badge" style={{
      background: type === 'call' ? '#e0f2fe' : '#ede9fe',
      color: type === 'call' ? '#0369a1' : '#5b21b6',
    }}>
      {type === 'call' ? '📞 Call' : '🎥 Meeting'}
    </span>
  );
}

// ---- Record Ref Pill ----
export function RefPill({ ref: refStr }: { ref: string }) {
  return <span className="record-ref-pill">{refStr}</span>;
}

// ---- Flag Warning ----
export function FlagWarning({ message }: { message: string }) {
  return (
    <div className="flag-warning">
      <span>⚠️</span>
      <span>{message}</span>
    </div>
  );
}

// ---- Evidence Quote ----
export function EvidenceQuote({
  quote,
  cite,
}: {
  quote: string;
  cite?: string;
}) {
  return (
    <div>
      <div className="evidence-quote">"{quote}"</div>
      {cite && <div className="evidence-cite">— {cite}</div>}
    </div>
  );
}

// ---- Progress Bar ----
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ---- Simple Bar Chart ----
export function BarChart({
  items,
  maxValue,
}: {
  items: Array<{ label: string; value: number; color?: string }>;
  maxValue?: number;
}) {
  const max = maxValue ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="bar-chart">
      {items.map((item) => (
        <div key={item.label} className="bar-row">
          <div className="bar-label" title={item.label}>{item.label}</div>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{
                width: `${Math.round((item.value / max) * 100)}%`,
                background: item.color ?? 'var(--teal-400)',
              }}
            />
          </div>
          <div className="bar-count">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

// ---- Empty State ----
export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="empty-state">
      <div className="empty-state-title">{title}</div>
      {description && <div className="empty-state-desc">{description}</div>}
    </div>
  );
}

// ---- Loading Spinner ----
export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <span
      className="loading-spinner"
      style={{ width: size, height: size }}
    />
  );
}

// ---- Definition Tooltip ----
export function Definition({ text }: { text: string }) {
  return (
    <div className="card-definition">
      <span style={{ color: 'var(--text-muted)' }}>ⓘ</span> {text}
    </div>
  );
}

// ---- Metric Card ----
export function MetricCard({
  value,
  label,
  definition,
  variant,
  sub,
}: {
  value: string | number;
  label: string;
  definition?: string;
  variant?: 'accent' | 'warning' | 'danger';
  sub?: string;
}) {
  return (
    <div className={`metric-card ${variant ?? ''}`}>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      {sub && <div className="metric-definition" style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{sub}</div>}
      {definition && <div className="metric-definition">{definition}</div>}
    </div>
  );
}

// ---- Section Card ----
export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card ${className ?? ''}`} style={{ marginBottom: 16 }}>
      <div className="card-header">
        <span className="card-title">{title}</span>
        {action}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
