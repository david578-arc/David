import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getEndpoint } from '../../config/api';
import './PlayerManagement.css';

const Bar = ({ label, value, max = 100 }) => {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="stat-bar">
      <div className="stat-bar-label">{label}</div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: pct + '%' }}></div>
      </div>
      <div className="stat-bar-value">{value}</div>
    </div>
  );
};

const PlayerStatistics = ({ token, playerId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const url = getEndpoint('PLAYER_STATS', { id: playerId });
        const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
        setStats(res.data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    if (playerId) load();
  }, [playerId, token]);

  const handleDownload = () => {
    if (!stats) return;
    const data = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `player-${stats.player?.id || playerId}-stats.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div>Loading statistics…</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!stats) return null;

  const goals = stats.goalsScored || 0;
  const caps = stats.capsEarned || 0;
  const age = stats.age || 0;

  return (
    <div className="player-stats-container">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Player Statistics</h2>
        <button className="btn" onClick={handleDownload} title="Download statistics">Download</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Goals</div>
          <div className="stat-value">{goals}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Caps</div>
          <div className="stat-value">{caps}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Age</div>
          <div className="stat-value">{age}</div>
        </div>
      </div>

      <div className="chart-area" style={{ marginTop: '16px' }}>
        <Bar label="Goals" value={goals} max={50} />
        <Bar label="Caps" value={caps} max={150} />
        <Bar label="Fitness" value={Math.max(10, 100 - (age - 20))} max={100} />
      </div>
    </div>
  );
};

export default PlayerStatistics;


