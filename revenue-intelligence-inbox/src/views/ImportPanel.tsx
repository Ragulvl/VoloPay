// ============================================================
// Import Panel View
// ============================================================

import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

export function ImportPanel() {
  const { state, importData, resetApp } = useApp();
  const { lastImportResult } = state;
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      const text = await file.text();
      await importData(text);
    } finally {
      setLoading(false);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) handleFile(file);
  };

  const totalRecords = state.records.length;
  const usableCount = state.records.filter((r) => r.intake_state === 'has_text').length;

  return (
    <div className="page-body" style={{ maxWidth: 800 }}>
      {/* Current state */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title">Current dataset state</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{totalRecords}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Unique records</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {state.records.filter(r => r.source_type === 'call').length} calls,{' '}
                {state.records.filter(r => r.source_type === 'meeting').length} meetings
              </div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--teal-600)' }}>{usableCount}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Usable texts</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Coverage: {totalRecords > 0 ? Math.round(usableCount / totalRecords * 100) : 0}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-secondary)' }}>
                {state.records.filter(r => r.manual_override).length}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Manual overrides</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: state.records.some(r => r.analysis?.freshness === 'pending_review') ? '#b45309' : 'var(--teal-600)' }}>
                {state.records.filter(r => r.analysis?.freshness === 'pending_review').length}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Pending review</div>
            </div>
          </div>
        </div>
      </div>

      {/* Drop zone */}
      <div
        className={`import-drop-zone ${dragOver ? 'drag-over' : ''}`}
        style={{ marginBottom: 20 }}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="import-drop-zone-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 16.5v-9m-4 5 4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.25 16.5v2.25A1.5 1.5 0 0 1 18.75 20H5.25a1.5 1.5 0 0 1-1.5-1.5V16.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {loading ? (
          <div className="import-drop-zone-text">Importing…</div>
        ) : (
          <>
            <div className="import-drop-zone-text">Drop a JSON file here or click to browse</div>
            <div className="import-drop-zone-sub">Accepts 01_initial.json or 02_update.json</div>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {/* Import rules */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header"><span className="card-title">Import rules</span></div>
        <div className="card-body">
          <ul style={{ fontSize: 12, color: 'var(--text-secondary)', paddingLeft: 20, lineHeight: 2 }}>
            <li>Identity = (source_type, source_id) — not record_ref, name, phone or array position</li>
            <li>Same or older revision is ignored. Revision 1 re-imported after revision 2 has no effect</li>
            <li>A newer revision replaces the entire payload and transcript_payload (no partial merge)</li>
            <li>Manual route overrides survive any revision update and are cleared only by explicit reset</li>
            <li>When transcript content changes, analysis is marked <em>pending review</em></li>
            <li>Null is distinct from false, zero and empty array</li>
          </ul>
        </div>
      </div>

      {/* Last import result */}
      {lastImportResult && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <span className="card-title">Last import result</span>
            <span className="td-muted">Batch: {lastImportResult.batch_id} · revision {lastImportResult.revision}</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 24, marginBottom: 12, flexWrap: 'wrap' }}>
              <div className="import-stat">
                <span className="import-stat-num stat-inserted">{lastImportResult.inserted}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>inserted</span>
              </div>
              <div className="import-stat">
                <span className="import-stat-num stat-updated">{lastImportResult.updated}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>updated</span>
              </div>
              <div className="import-stat">
                <span className="import-stat-num stat-ignored">{lastImportResult.ignored}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ignored</span>
              </div>
              <div className="import-stat">
                <span className="import-stat-num stat-rejected">{lastImportResult.rejected}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>rejected</span>
              </div>
            </div>
            {lastImportResult.errors.length > 0 && (
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 6, padding: '10px 14px', fontSize: 12 }}>
                <div style={{ fontWeight: 600, color: '#991b1b', marginBottom: 6 }}>Errors</div>
                {lastImportResult.errors.map((e, i) => (
                  <div key={i} style={{ color: '#7f1d1d' }}>{e}</div>
                ))}
              </div>
            )}
            <div style={{ marginTop: 12 }}>
              <table style={{ fontSize: 11, width: '100%' }}>
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Source ID (first 12)</th>
                    <th>Action</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {lastImportResult.details.map((d, i) => (
                    <tr key={i}>
                      <td><span className="record-ref-pill">{d.record_ref}</span></td>
                      <td className="td-mono">{d.source_id.substring(0, 12)}…</td>
                      <td>
                        <span className={`badge ${
                          d.action === 'inserted' ? 'badge-current' :
                          d.action === 'updated' ? 'badge-supported' :
                          d.action === 'ignored' ? '' :
                          'badge-insufficient'
                        }`} style={{ fontSize: 10 }}>
                          {d.action}
                        </span>
                      </td>
                      <td className="td-muted">{d.reason ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Import history */}
      {state.importResults.length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><span className="card-title">Import history</span></div>
          <div className="card-body">
            <table style={{ fontSize: 12 }}>
              <thead>
                <tr>
                  <th>Batch</th>
                  <th>Rev</th>
                  <th>Inserted</th>
                  <th>Updated</th>
                  <th>Ignored</th>
                  <th>Imported at</th>
                </tr>
              </thead>
              <tbody>
                {state.importResults.slice().reverse().map((r, i) => (
                  <tr key={i}>
                    <td className="td-mono">{r.batch_id}</td>
                    <td>{r.revision}</td>
                    <td className="stat-inserted" style={{ fontWeight: 600 }}>{r.inserted}</td>
                    <td style={{ color: 'var(--teal-600)', fontWeight: 600 }}>{r.updated}</td>
                    <td className="td-muted">{r.ignored}</td>
                    <td className="td-muted">{new Date(r.importedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reset */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Reset application</span>
        </div>
        <div className="card-body">
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Clears all records, import history and settings. Use this to reproduce the replay acceptance test from scratch.
          </div>
          {!confirmReset ? (
            <button className="btn btn-danger" onClick={() => setConfirmReset(true)}>
              Reset / Clean start
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#991b1b' }}>Are you sure? This clears all data.</span>
              <button className="btn btn-danger" onClick={async () => { await resetApp(); setConfirmReset(false); }}>
                Yes, reset everything
              </button>
              <button className="btn btn-secondary" onClick={() => setConfirmReset(false)}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
