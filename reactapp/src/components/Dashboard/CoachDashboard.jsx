import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const CoachDashboard = ({ user, stats, token }) => {
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [playersRes, matchesRes] = await Promise.all([
        axios.get(`https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/players/team/${user.teamId}`, config),
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches', config)
      ]);

      setTeamPlayers(playersRes.data);
      setMatches(matchesRes.data);
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerSelection = async (playerId, updates) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put(`https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/players/${playerId}`, updates, config);
      fetchTeamData();
    } catch (error) {
      console.error('Error updating player:', error);
    }
  };

  return (
    <div className="coach-dashboard">
      <div className="dashboard-grid">
        {/* Team Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Squad Size</h3>
            <span className="stat-number">{teamPlayers.length}</span>
          </div>
          <div className="stat-card">
            <h3>Available Players</h3>
            <span className="stat-number">
              {teamPlayers.filter(p => p.isAvailable).length}
            </span>
          </div>
          <div className="stat-card">
            <h3>Medical Clearance</h3>
            <span className="stat-number">
              {teamPlayers.filter(p => p.medicalClearance).length}
            </span>
          </div>
          <div className="stat-card">
            <h3>Upcoming Matches</h3>
            <span className="stat-number">
              {matches.filter(m => 
                (m.homeTeam?.teamName === user.team || m.awayTeam?.teamName === user.team) &&
                new Date(m.matchDate) > new Date()
              ).length}
            </span>
          </div>
        </div>

        {/* Player Selection */}
        <div className="dashboard-section">
          <h2>Player Selection & Management</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Jersey #</th>
                  <th>Age</th>
                  <th>Goals</th>
                  <th>Medical</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamPlayers.map(player => (
                  <tr key={player.id}>
                    <td>{player.playerName}</td>
                    <td>{player.position}</td>
                    <td>{player.jerseyNumber || 'N/A'}</td>
                    <td>{player.age}</td>
                    <td>{player.goalsScored || 0}</td>
                    <td>
                      <span className={`status-badge ${player.medicalClearance ? 'active' : 'inactive'}`}>
                        {player.medicalClearance ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${player.isAvailable ? 'active' : 'inactive'}`}>
                        {player.isAvailable ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handlePlayerSelection(player.id, { 
                          isAvailable: !player.isAvailable 
                        })}
                        className="action-button"
                      >
                        Toggle Selection
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tactical Analysis */}
        <div className="dashboard-section">
          <h2>Tactical Analysis</h2>
          <div className="tactical-grid">
            <div className="tactical-card">
              <h3>Formation Analysis</h3>
              <div className="formation-stats">
                {['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Striker'].map(position => {
                  const count = teamPlayers.filter(p => p.position === position).length;
                  return (
                    <div key={position} className="formation-item">
                      <span className="position-label">{position}:</span>
                      <span className="position-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="tactical-card">
              <h3>Age Distribution</h3>
              <div className="age-stats">
                <div className="age-item">
                  <span className="age-label">Under 25:</span>
                  <span className="age-count">
                    {teamPlayers.filter(p => p.age < 25).length}
                  </span>
                </div>
                <div className="age-item">
                  <span className="age-label">25-30:</span>
                  <span className="age-count">
                    {teamPlayers.filter(p => p.age >= 25 && p.age <= 30).length}
                  </span>
                </div>
                <div className="age-item">
                  <span className="age-label">Over 30:</span>
                  <span className="age-count">
                    {teamPlayers.filter(p => p.age > 30).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Match Schedule */}
        <div className="dashboard-section">
          <h2>Match Schedule</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Opponent</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Preparation</th>
                </tr>
              </thead>
              <tbody>
                {matches
                  .filter(match => 
                    match.homeTeam?.teamName === user.team || 
                    match.awayTeam?.teamName === user.team
                  )
                  .sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate))
                  .map(match => {
                    const isHome = match.homeTeam?.teamName === user.team;
                    const opponent = isHome ? match.awayTeam?.teamName : match.homeTeam?.teamName;
                    
                    return (
                      <tr key={match.id}>
                        <td>
                          {isHome ? 'vs' : '@'} {opponent}
                        </td>
                        <td>{new Date(match.matchDate).toLocaleDateString()}</td>
                        <td>{match.venue?.venueName || 'TBD'}</td>
                        <td>
                          <span className={`status-badge ${match.status.toLowerCase()}`}>
                            {match.status}
                          </span>
                        </td>
                        <td>
                          <button className="preparation-button">
                            View Analysis
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;

