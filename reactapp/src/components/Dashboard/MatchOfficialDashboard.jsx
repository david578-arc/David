import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const MatchOfficialDashboard = ({ user, stats, token }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMatchData();
  }, []);

  const fetchMatchData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const matchesRes = await axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches', config);
      setMatches(matchesRes.data);
    } catch (error) {
      console.error('Error fetching match data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="match-official-dashboard">
      <div className="dashboard-grid">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Assigned Matches</h3>
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
          <h2>Match Management</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Home Team</th>
                  <th>Away Team</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {matches.map(match => (
                  <tr key={match.id}>
                    <td>{match.homeTeam?.teamName}</td>
                    <td>{match.awayTeam?.teamName}</td>
                    <td>{new Date(match.matchDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${match.status.toLowerCase()}`}>
                        {match.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-button">
                        Manage Match
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchOfficialDashboard;

