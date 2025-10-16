import React, { useEffect, useState } from 'react';
import './MatchStatistics.css';
import { getEndpoint } from '../../config/api';

const MatchStatistics = ({ matchId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const url = getEndpoint('MATCH_STATS', { id: matchId });
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed');
        setStats(await res.json());
      } catch (e) {
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    if (matchId) load();
  }, [matchId]);

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return null;

  return (
    <div className="match-statistics card">
      <div className="ms-header">
        <h4>Match Statistics</h4>
        <div className={`ms-status ${stats.status?.toLowerCase()}`}>{stats.status}</div>
      </div>
      <div className="ms-score">
        <div className="team home">
          <div className="label">Home</div>
          <div className="value">{stats.homeScore}</div>
        </div>
        <div className="separator">-</div>
        <div className="team away">
          <div className="label">Away</div>
          <div className="value">{stats.awayScore}</div>
        </div>
      </div>
      <div className="ms-grid">
        <div className="ms-item"><span>Kickoff</span><b>{stats.kickoffTime}</b></div>
        {stats.possession && <div className="ms-item"><span>Possession</span><b>{stats.possession.home}% - {stats.possession.away}%</b></div>}
        {stats.shots && <div className="ms-item"><span>Shots</span><b>{stats.shots.home} - {stats.shots.away}</b></div>}
        {stats.shotsOnTarget && <div className="ms-item"><span>On Target</span><b>{stats.shotsOnTarget.home} - {stats.shotsOnTarget.away}</b></div>}
        {stats.fouls && <div className="ms-item"><span>Fouls</span><b>{stats.fouls.home} - {stats.fouls.away}</b></div>}
        {stats.cards && <div className="ms-item"><span>Cards</span><b>{stats.cards.yellow}🟨 / {stats.cards.red}🟥</b></div>}
      </div>
    </div>
  );
};

export default MatchStatistics;




