import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const MediaDashboard = ({ user, stats, token }) => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMediaData();
  }, []);

  const fetchMediaData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [matchesRes, teamsRes] = await Promise.all([
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches', config),
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/teams', config)
      ]);

      setMatches(matchesRes.data);
      setTeams(teamsRes.data);
    } catch (error) {
      console.error('Error fetching media data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="media-dashboard">
      <div className="dashboard-grid">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Teams</h3>
            <span className="stat-number">{teams.length}</span>
          </div>
          <div className="stat-card">
            <h3>Total Matches</h3>
            <span className="stat-number">{matches.length}</span>
          </div>
          <div className="stat-card">
            <h3>Upcoming Matches</h3>
            <span className="stat-number">
              {matches.filter(m => m.status === 'SCHEDULED').length}
            </span>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Tournament Information</h2>
          <div className="media-content">
            <p>Access to tournament information, match schedules, and press conference scheduling.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDashboard;

