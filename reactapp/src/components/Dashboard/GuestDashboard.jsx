import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const GuestDashboard = ({ user, stats, token }) => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    setLoading(true);
    try {
      const [matchesRes, teamsRes] = await Promise.all([
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches'),
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/teams')
      ]);

      setMatches(matchesRes.data);
      setTeams(teamsRes.data);
    } catch (error) {
      console.error('Error fetching public data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guest-dashboard">
      <div className="dashboard-grid">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Participating Teams</h3>
            <span className="stat-number">{teams.length}</span>
          </div>
          <div className="stat-card">
            <h3>Total Matches</h3>
            <span className="stat-number">{matches.length}</span>
          </div>
          <div className="stat-card">
            <h3>Completed Matches</h3>
            <span className="stat-number">
              {matches.filter(m => m.status === 'COMPLETED').length}
            </span>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Tournament Information</h2>
          <div className="public-content">
            <p>Welcome to the FIFA Management System. View tournament information and match schedules.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;

