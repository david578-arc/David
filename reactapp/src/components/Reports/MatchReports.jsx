import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getEndpoint } from '../../config/api';
import './MatchReports.css';

const ROLES_CAN_FILE = new Set(['FIFA_ADMIN','TOURNAMENT_DIRECTOR','MATCH_OFFICIAL']);

const MatchReports = ({ token, user }) => {
  const canFile = useMemo(() => !!user && ROLES_CAN_FILE.has(user.role), [user]);
  const [matches, setMatches] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ matchId: '', summary: '', incidents: '' });

  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [m] = await Promise.all([
        axios.get(getEndpoint('MATCHES_PAST'), headers)
      ]);
      setMatches(m.data || []);
      // For demo, keep reports local
      try { setReports(JSON.parse(localStorage.getItem('match_reports') || '[]')); } catch { setReports([]); }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load');
    } finally { setLoading(false); }
  };

  const saveReport = () => {
    if (!canFile) return;
    if (!form.matchId || !form.summary) { setError('Select match and add summary'); return; }
    const report = { id: Date.now(), ...form, createdAt: new Date().toISOString(), author: user?.username };
    const next = [report, ...reports];
    setReports(next);
    try { localStorage.setItem('match_reports', JSON.stringify(next)); } catch {}
    setForm({ matchId: '', summary: '', incidents: '' });
  };

  const remove = (id) => {
    if (!canFile) return;
    const next = reports.filter(r => r.id !== id);
    setReports(next);
    try { localStorage.setItem('match_reports', JSON.stringify(next)); } catch {}
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Match Reports</h2>
      </div>
      {loading && <div>Loading…</div>}
      {error && <div className="error-message">{error}</div>}

      {canFile && (
        <div className="report-form">
          <div className="grid-2">
            <div className="form-group">
              <label>Match</label>
              <select value={form.matchId} onChange={(e) => setForm({ ...form, matchId: e.target.value })}>
                <option value="">Select a match</option>
                {matches.map(m => (
                  <option key={m.id} value={m.id}>{m.homeTeam?.teamName || 'TBD'} vs {m.awayTeam?.teamName || 'TBD'} ({new Date(m.matchDate).toLocaleDateString()})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Summary</label>
              <input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Incidents</label>
            <textarea rows={6} value={form.incidents} onChange={(e) => setForm({ ...form, incidents: e.target.value })} />
          </div>
          <div className="row right">
            <button className="btn" onClick={saveReport}>File Report</button>
          </div>
        </div>
      )}

      <div className="reports-list">
        {reports.map(r => (
          <div key={r.id} className="report-item">
            <div>
              <div className="report-title">Report for match #{r.matchId}</div>
              <div className="report-meta">By {r.author} on {new Date(r.createdAt).toLocaleString()}</div>
              <div className="report-summary">{r.summary}</div>
              {r.incidents && <div className="report-incidents"><b>Incidents:</b> {r.incidents}</div>}
            </div>
            {canFile && <button className="btn danger" onClick={() => remove(r.id)}>Delete</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchReports;


