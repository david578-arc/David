import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const PlayerDashboard = ({ user, stats, token }) => {
  const [player, setPlayer] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlayerData();
  }, []);

  const fetchPlayerData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Find player by username or team
      const playersRes = await axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/players', config);
      const playerData = playersRes.data.find(p => 
        p.playerName.toLowerCase().includes(user.username.toLowerCase()) ||
        (user.team && p.team?.teamName === user.team)
      );

      if (playerData) {
        setPlayer(playerData);
        
        // Fetch player stats
        const statsRes = await axios.get(`https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/players/${playerData.id}/stats`, config);
        setPlayer(prev => ({ ...prev, ...statsRes.data }));
      }

      // Fetch matches
      const matchesRes = await axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches', config);
      setMatches(matchesRes.data);
    } catch (error) {
      console.error('Error fetching player data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePlayerProfile = async (updates) => {
    if (!player) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put(`https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/players/${player.id}`, updates, config);
      fetchPlayerData();
    } catch (error) {
      console.error('Error updating player profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading player data...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="no-data">
        <h2>Player Profile Not Found</h2>
        <p>Your player profile could not be found. Please contact your team manager.</p>
      </div>
    );
  }

  const playerMatches = matches.filter(match => 
    match.homeTeam?.teamName === player.team?.teamName || 
    match.awayTeam?.teamName === player.team?.teamName
  );

  return (
    <div className="player-dashboard">
      <div className="dashboard-grid">
        {/* Player Profile */}
        <div className="player-profile-section">
          <h2>My Profile</h2>
          <div className="player-profile-card">
            <div className="profile-header">
              <div className="player-info">
                <h3>{player.playerName}</h3>
                <p>{player.position} • #{player.jerseyNumber}</p>
                <p>{player.team?.teamName} • {player.nationality}</p>
              </div>
              <div className="player-stats">
                <div className="stat-item">
                  <span className="stat-label">Age</span>
                  <span className="stat-value">{player.age}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Goals</span>
                  <span className="stat-value">{player.goalsScored || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Caps</span>
                  <span className="stat-value">{player.capsEarned || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">Club Affiliation:</span>
                <span className="detail-value">{player.clubAffiliation || 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Medical Clearance:</span>
                <span className={`status-badge ${player.medicalClearance ? 'active' : 'inactive'}`}>
                  {player.medicalClearance ? 'Cleared' : 'Pending'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Availability:</span>
                <span className={`status-badge ${player.isAvailable ? 'active' : 'inactive'}`}>
                  {player.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* My Matches */}
        <div className="dashboard-section">
          <h2>My Matches</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Opponent</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {playerMatches.map(match => {
                  const isHome = match.homeTeam?.teamName === player.team?.teamName;
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
                        {match.homeScore !== null && match.awayScore !== null
                          ? `${match.homeScore} - ${match.awayScore}`
                          : 'TBD'
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="dashboard-section">
          <h2>Performance Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Goals Scored</h3>
              <span className="stat-number">{player.goalsScored || 0}</span>
            </div>
            <div className="stat-card">
              <h3>International Caps</h3>
              <span className="stat-number">{player.capsEarned || 0}</span>
            </div>
            <div className="stat-card">
              <h3>Matches Played</h3>
              <span className="stat-number">{playerMatches.filter(m => m.status === 'COMPLETED').length}</span>
            </div>
            <div className="stat-card">
              <h3>Goals per Match</h3>
              <span className="stat-number">
                {playerMatches.filter(m => m.status === 'COMPLETED').length > 0
                  ? ((player.goalsScored || 0) / playerMatches.filter(m => m.status === 'COMPLETED').length).toFixed(2)
                  : '0.00'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;

