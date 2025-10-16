import React, { useEffect, useMemo, useRef, useState } from 'react';
import './TacticalAnalysis.css';

// Roles allowed to access tactical analysis fully
const ALLOWED = new Set(['COACH', 'TEAM_MANAGER']);

const defaultPlan = {
  name: 'Default 4-3-3',
  formation: '4-3-3',
  notes: 'Compact mid block, aggressive counter-press after loss.',
  setPieces: {
    corners: 'Near-post flick-on, overload back post',
    freeKicks: 'Two over the ball, short options prioritized',
    throwIns: 'Quick restarts to fullbacks',
  },
  positions: [
    { id: 'GK', x: 50, y: 90 },
    { id: 'RB', x: 80, y: 75 }, { id: 'RCB', x: 65, y: 80 }, { id: 'LCB', x: 35, y: 80 }, { id: 'LB', x: 20, y: 75 },
    { id: 'RCM', x: 60, y: 60 }, { id: 'CM', x: 50, y: 55 }, { id: 'LCM', x: 40, y: 60 },
    { id: 'RW', x: 80, y: 35 }, { id: 'ST', x: 50, y: 25 }, { id: 'LW', x: 20, y: 35 },
  ]
};

const Pitch = ({ positions, onDrag }) => {
  const pitchRef = useRef(null);

  const handleMouseDown = (e, id) => {
    const pitch = pitchRef.current;
    if (!pitch) return;
    const rect = pitch.getBoundingClientRect();
    const move = (ev) => {
      const x = ((ev.clientX - rect.left) / rect.width) * 100;
      const y = ((ev.clientY - rect.top) / rect.height) * 100;
      onDrag(id, Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y)));
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  return (
    <div className="pitch" ref={pitchRef}>
      <div className="halfway-line" />
      <div className="center-circle" />
      <div className="penalty-box top" />
      <div className="penalty-box bottom" />
      {positions.map(p => (
        <div
          key={p.id}
          className="player-dot"
          style={{ left: p.x + '%', top: p.y + '%' }}
          onMouseDown={(e) => handleMouseDown(e, p.id)}
          title={p.id}
        >
          {p.id}
        </div>
      ))}
    </div>
  );
};

const TacticalAnalysis = ({ token, user }) => {
  const allowed = useMemo(() => !!user && ALLOWED.has(user.role), [user]);
  const [tab, setTab] = useState('Formation');
  const [plan, setPlan] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tactical_plan') || 'null') || defaultPlan; } catch { return defaultPlan; }
  });
  const [customName, setCustomName] = useState(plan.name);
  const [message, setMessage] = useState('');

  useEffect(() => {
    try { localStorage.setItem('tactical_plan', JSON.stringify(plan)); } catch {}
  }, [plan]);

  const setFormation = (formation) => {
    if (!allowed) return;
    setPlan(prev => ({ ...prev, formation }));
  };

  const setNotes = (notes) => {
    if (!allowed) return;
    setPlan(prev => ({ ...prev, notes }));
  };

  const setSetPiece = (key, value) => {
    if (!allowed) return;
    setPlan(prev => ({ ...prev, setPieces: { ...prev.setPieces, [key]: value } }));
  };

  const handleDrag = (id, x, y) => {
    if (!allowed) return;
    setPlan(prev => ({ ...prev, positions: prev.positions.map(p => p.id === id ? { ...p, x, y } : p) }));
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${plan.name.replace(/\s+/g,'-').toLowerCase()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try { setPlan(JSON.parse(reader.result)); setMessage('Plan imported'); }
      catch { setMessage('Invalid file'); }
    };
    reader.readAsText(file);
  };

  const saveAs = () => {
    if (!allowed) return;
    setPlan(prev => ({ ...prev, name: customName || prev.name }));
    setMessage('Saved');
  };

  return (
    <div className="tactics-container">
      <div className="tactics-header">
        <h2>Tactical Analysis</h2>
        <div className="tabs">
          {['Formation','Set Pieces','Notes','Library'].map(t => (
            <button key={t} className={`tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </div>

      {message && <div className="tactics-message">{message}</div>}

      {tab === 'Formation' && (
        <div className="tactics-section">
          <div className="tactics-controls">
            <label>
              Name
              <input value={customName} onChange={(e) => setCustomName(e.target.value)} disabled={!allowed} />
            </label>
            <label>
              Formation
              <select value={plan.formation} onChange={(e) => setFormation(e.target.value)} disabled={!allowed}>
                <option>4-3-3</option>
                <option>4-2-3-1</option>
                <option>3-5-2</option>
                <option>3-4-3</option>
                <option>4-4-2</option>
              </select>
            </label>
            <div className="row">
              <button className="btn" onClick={saveAs} disabled={!allowed}>Save</button>
              <button className="btn" onClick={exportJson}>Export</button>
              <label className="btn">
                Import
                <input type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
              </label>
            </div>
          </div>
          <Pitch positions={plan.positions} onDrag={handleDrag} />
        </div>
      )}

      {tab === 'Set Pieces' && (
        <div className="tactics-section grid-2">
          {['corners','freeKicks','throwIns'].map(key => (
            <div key={key} className="form-group">
              <label>{key === 'freeKicks' ? 'Free Kicks' : key.charAt(0).toUpperCase()+key.slice(1)}</label>
              <textarea rows={6} value={plan.setPieces[key] || ''} onChange={(e) => setSetPiece(key, e.target.value)} disabled={!allowed} />
            </div>
          ))}
        </div>
      )}

      {tab === 'Notes' && (
        <div className="tactics-section">
          <div className="form-group">
            <label>Coaching Notes</label>
            <textarea rows={10} value={plan.notes} onChange={(e) => setNotes(e.target.value)} disabled={!allowed} />
          </div>
        </div>
      )}

      {tab === 'Library' && (
        <div className="tactics-section">
          <p>Manage multiple tactical plans. Save/Export current plan and import as needed.</p>
          <div className="library-list">
            <div className="library-item">
              <div>
                <div className="lib-title">{plan.name}</div>
                <div className="lib-sub">{plan.formation}</div>
              </div>
              <div className="row">
                <button className="btn" onClick={exportJson}>Export</button>
                <label className="btn">
                  Import
                  <input type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TacticalAnalysis;


