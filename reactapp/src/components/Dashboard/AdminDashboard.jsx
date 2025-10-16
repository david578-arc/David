import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const AdminDashboard = ({ user, stats, token }) => {
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [teamsRes, playersRes, matchesRes, usersRes] = await Promise.all([
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/teams', config),
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/players', config),
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches', config),
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/auth/users', config)
      ]);

      setTeams(teamsRes.data);
      setPlayers(playersRes.data);
      setMatches(matchesRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamStatusUpdate = async (teamId, newStatus) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put(`https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/teams/${teamId}/status`, 
        { status: newStatus }, config);
      
      fetchAllData();
    } catch (error) {
      console.error('Error updating team status:', error);
    }
  };

  const handleUserStatusUpdate = async (userId, isActive) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const user = users.find(u => u.id === userId);
      user.isActive = isActive;
      
      await axios.put(`http://localhost:8080/api/auth/users/${userId}`, user, config);
      fetchAllData();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-grid">
        {/* System Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Teams</h3>
            <span className="stat-number">{teams.length}</span>
          </div>
          <div className="stat-card">
            <h3>Total Players</h3>
            <span className="stat-number">{players.length}</span>
          </div>
          <div className="stat-card">
            <h3>Total Matches</h3>
            <span className="stat-number">{matches.length}</span>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <span className="stat-number">{users.length}</span>
          </div>
        </div>

        {/* Team Management */}
        <div className="dashboard-section">
          <h2>Team Management</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Confederation</th>
                  <th>FIFA Ranking</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(team => (
                  <tr key={team.id}>
                    <td>{team.teamName}</td>
                    <td>{team.confederation}</td>
                    <td>{team.fifaRanking || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${team.status.toLowerCase()}`}>
                        {team.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={team.status}
                        onChange={(e) => handleTeamStatusUpdate(team.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="ELIMINATED">Eliminated</option>
                        <option value="CHAMPION">Champion</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Management */}
        <div className="dashboard-section">
          <h2>User Management</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Team</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.team || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleUserStatusUpdate(user.id, !user.isActive)}
                        className={`status-button ${user.isActive ? 'deactivate' : 'activate'}`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Analytics */}
        {stats.teamAnalytics && (
          <div className="dashboard-section">
            <h2>System Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Team Status Distribution</h3>
                <div className="analytics-content">
                  {Object.entries(stats.teamAnalytics.statusCounts || {}).map(([status, count]) => (
                    <div key={status} className="analytics-item">
                      <span className="analytics-label">{status}:</span>
                      <span className="analytics-value">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>Confederation Distribution</h3>
                <div className="analytics-content">
                  {Object.entries(stats.teamAnalytics.confederationCounts || {}).map(([conf, count]) => (
                    <div key={conf} className="analytics-item">
                      <span className="analytics-label">{conf}:</span>
                      <span className="analytics-value">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

