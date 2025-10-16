import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const TournamentDirectorDashboard = ({ user, stats, token }) => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTournamentData();
  }, []);

  const fetchTournamentData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [teamsRes, matchesRes] = await Promise.all([
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/teams', config),
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches', config)
      ]);

      setTeams(teamsRes.data);
      setMatches(matchesRes.data);
    } catch (error) {
      console.error('Error fetching tournament data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tournament-director-dashboard">
      <div className="dashboard-grid">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Registered Teams</h3>
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
          <div className="stat-card">
            <h3>Upcoming Matches</h3>
            <span className="stat-number">
              {matches.filter(m => m.status === 'SCHEDULED').length}
            </span>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Tournament Overview</h2>
          <div className="tournament-overview">
            <p>Manage tournament scheduling, venue coordination, and match progression.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDirectorDashboard;

