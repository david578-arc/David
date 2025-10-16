import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const TeamManagerDashboard = ({ user, stats, token }) => {
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

  const handlePlayerUpdate = async (playerId, updates) => {
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
    <div className="team-manager-dashboard">
      <div className="dashboard-grid">
        {/* Team Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Team Players</h3>
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
            <h3>Total Goals</h3>
            <span className="stat-number">
              {teamPlayers.reduce((sum, p) => sum + (p.goalsScored || 0), 0)}
            </span>
          </div>
        </div>

        {/* Player Management */}
        <div className="dashboard-section">
          <h2>Player Management</h2>
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
                        onClick={() => handlePlayerUpdate(player.id, { 
                          isAvailable: !player.isAvailable 
                        })}
                        className="action-button"
                      >
                        Toggle Availability
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Matches */}
        <div className="dashboard-section">
          <h2>Team Matches</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Home Team</th>
                  <th>Away Team</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {matches
                  .filter(match => 
                    match.homeTeam?.teamName === user.team || 
                    match.awayTeam?.teamName === user.team
                  )
                  .map(match => (
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
                        {match.homeScore !== null && match.awayScore !== null
                          ? `${match.homeScore} - ${match.awayScore}`
                          : 'TBD'
                        }
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

export default TeamManagerDashboard;

