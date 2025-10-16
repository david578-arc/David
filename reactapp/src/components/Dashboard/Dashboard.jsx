import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

// Import role-specific components
import AdminDashboard from './AdminDashboard';
import TeamManagerDashboard from './TeamManagerDashboard';
import CoachDashboard from './CoachDashboard';
import PlayerDashboard from './PlayerDashboard';
import TournamentDirectorDashboard from './TournamentDirectorDashboard';
import MatchOfficialDashboard from './MatchOfficialDashboard';
import MediaDashboard from './MediaDashboard';
import GuestDashboard from './GuestDashboard';

const Dashboard = ({ user, token }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch different stats based on user role
      const endpoints = [];
      
      if (user.role === 'FIFA_ADMIN') {
        endpoints.push(
          axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/teams/analytics', config),
          axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/players', config),
          axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches', config)
        );
      } else if (user.role === 'TEAM_MANAGER' || user.role === 'COACH') {
        endpoints.push(
          axios.get(`https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/players/team/${user.teamId}`, config),
          axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches', config)
        );
      }

      if (endpoints.length > 0) {
        const responses = await Promise.all(endpoints);
        const newStats = {};
        
        responses.forEach((response, index) => {
          if (index === 0 && user.role === 'FIFA_ADMIN') {
            newStats.teamAnalytics = response.data;
          } else if (index === 1 && user.role === 'FIFA_ADMIN') {
            newStats.totalPlayers = response.data.length;
          } else if (index === 2 && user.role === 'FIFA_ADMIN') {
            newStats.totalMatches = response.data.length;
          } else if (user.role === 'TEAM_MANAGER' || user.role === 'COACH') {
            if (index === 0) newStats.teamPlayers = response.data;
            if (index === 1) newStats.matches = response.data;
          }
        });
        
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'FIFA_ADMIN':
        return <AdminDashboard user={user} stats={stats} token={token} />;
      case 'TEAM_MANAGER':
        return <TeamManagerDashboard user={user} stats={stats} token={token} />;
      case 'COACH':
        return <CoachDashboard user={user} stats={stats} token={token} />;
      case 'PLAYER':
        return <PlayerDashboard user={user} stats={stats} token={token} />;
      case 'TOURNAMENT_DIRECTOR':
        return <TournamentDirectorDashboard user={user} stats={stats} token={token} />;
      case 'MATCH_OFFICIAL':
        return <MatchOfficialDashboard user={user} stats={stats} token={token} />;
      case 'MEDIA_REPRESENTATIVE':
        return <MediaDashboard user={user} stats={stats} token={token} />;
      default:
        return <GuestDashboard user={user} stats={stats} token={token} />;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.username}</h1>
        <p>Role: {user.role.replace('_', ' ')}</p>
        {user.team && <p>Team: {user.team}</p>}
        {user.confederation && <p>Confederation: {user.confederation}</p>}
      </div>
      
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;

