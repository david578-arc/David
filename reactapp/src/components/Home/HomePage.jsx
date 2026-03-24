import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';

const HomePage = ({ user, token, onNavigate }) => {
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalPlayers: 0,
    totalMatches: 0,
    activeTournaments: 0
  });
  const [recentMatches, setRecentMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [teamsRes, playersRes, matchesRes, tournamentsRes] = await Promise.all([
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/teams', config),
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/players', config),
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches', config),
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/tournaments', config)
      ]);

      setStats({
        totalTeams: teamsRes.data.length,
        totalPlayers: playersRes.data.length,
        totalMatches: matchesRes.data.length,
        activeTournaments: tournamentsRes.data.filter(t => t.status === 'ACTIVE').length
      });

      // Get recent matches (last 5)
      const recent = matchesRes.data
        .filter(match => new Date(match.matchDate) < new Date())
        .sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate))
        .slice(0, 5);
      setRecentMatches(recent);

      // Get upcoming matches (next 5)
      const upcoming = matchesRes.data
        .filter(match => new Date(match.matchDate) > new Date())
        .sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate))
        .slice(0, 5);
      setUpcomingMatches(upcoming);

    } catch (err) {
      setError('Failed to fetch home data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getQuickActions = () => {
    const baseActions = [
      { id: 'teams', label: 'Team Management', icon: '⚽', color: 'teams' },
      { id: 'players', label: 'Player Management', icon: '👤', color: 'players' },
      { id: 'matches', label: 'Match Management', icon: '🏟️', color: 'matches' },
      { id: 'tournaments', label: 'Tournaments', icon: '🏆', color: 'tournaments' }
    ];

    if (user?.role === 'FIFA_ADMIN') {
      return [
        ...baseActions,
        { id: 'venues', label: 'Venues', icon: '📍', color: 'venues' },
        { id: 'officials', label: 'Officials', icon: '👨‍⚖️', color: 'officials' },
        { id: 'users', label: 'User Management', icon: '👥', color: 'users' },
        { id: 'analytics', label: 'AI Analytics', icon: '🤖', color: 'analytics' },
        { id: 'security', label: 'Security', icon: '🔒', color: 'security' }
      ];
    } else if (user?.role === 'TEAM_MANAGER') {
      return [
        ...baseActions,
        { id: 'analytics', label: 'AI Analytics', icon: '🤖', color: 'analytics' },
        { id: 'security', label: 'Security', icon: '🔒', color: 'security' }
      ];
    } else if (user?.role === 'TOURNAMENT_DIRECTOR') {
      return [
        ...baseActions,
        { id: 'venues', label: 'Venues', icon: '📍', color: 'venues' },
        { id: 'analytics', label: 'AI Analytics', icon: '🤖', color: 'analytics' },
        { id: 'security', label: 'Security', icon: '🔒', color: 'security' }
      ];
    } else if (user?.role === 'COACH') {
      return [
        { id: 'players', label: 'Player Selection', icon: '👤', color: 'players' },
        { id: 'matches', label: 'Match Preparation', icon: '🏟️', color: 'matches' },
        { id: 'tactics', label: 'Tactical Analysis', icon: '📋', color: 'tactics' }
      ];
    } else if (user?.role === 'PLAYER') {
      return [
        { id: 'profile', label: 'My Profile', icon: '👤', color: 'profile' },
        { id: 'matches', label: 'My Matches', icon: '🏟️', color: 'matches' },
        { id: 'stats', label: 'My Statistics', icon: '📊', color: 'stats' }
      ];
    }

    return baseActions;
  };

  const formatMatchResult = (match) => {
    if (match.status === 'COMPLETED' && match.homeScore !== null && match.awayScore !== null) {
      return `${match.homeScore} - ${match.awayScore}`;
    }
    return match.status;
  };

  const getMatchStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'completed';
      case 'LIVE': return 'live';
      case 'SCHEDULED': return 'scheduled';
      case 'CANCELLED': return 'cancelled';
      default: return 'scheduled';
    }
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading FIFA Management System...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              ⚽ FIFA Management System
              <span className="hero-subtitle">Championship Excellence</span>
            </h1>
            <p className="hero-description">
              Welcome to the world's most advanced football management platform. 
              Manage teams, players, matches, and tournaments with cutting-edge technology.
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-number">{stats.totalTeams}</span>
                <span className="stat-label">Teams</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">{stats.totalPlayers}</span>
                <span className="stat-label">Players</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">{stats.totalMatches}</span>
                <span className="stat-label">Matches</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">{stats.activeTournaments}</span>
                <span className="stat-label">Tournaments</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-elements">
              <div className="floating-ball">⚽</div>
              <div className="floating-trophy">🏆</div>
              <div className="floating-whistle">📯</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {getQuickActions().map(action => (
            <div 
              key={action.id}
              className={`quick-action-card ${action.color}`}
              onClick={() => onNavigate(action.id)}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-label">{action.label}</div>
              <div className="action-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Matches */}
      <div className="matches-section">
        <div className="section-header">
          <h2 className="section-title">Recent Matches</h2>
          <button 
            className="view-all-btn"
            onClick={() => onNavigate('matches')}
          >
            View All Matches →
          </button>
        </div>
        <div className="matches-grid">
          {recentMatches.map(match => (
            <div key={match.id} className="match-card recent">
              <div className="match-teams">
                <div className="team home">
                  <span className="team-name">{match.homeTeam?.teamName || 'TBD'}</span>
                </div>
                <div className="match-vs">
                  <span className="match-result">{formatMatchResult(match)}</span>
                  <span className="match-date">
                    {new Date(match.matchDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="team away">
                  <span className="team-name">{match.awayTeam?.teamName || 'TBD'}</span>
                </div>
              </div>
              <div className="match-status">
                <span className={`status-badge ${getMatchStatusColor(match.status)}`}>
                  {match.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="matches-section">
        <div className="section-header">
          <h2 className="section-title">Upcoming Matches</h2>
          <button 
            className="view-all-btn"
            onClick={() => onNavigate('matches')}
          >
            View All Matches →
          </button>
        </div>
        <div className="matches-grid">
          {upcomingMatches.map(match => (
            <div key={match.id} className="match-card upcoming">
              <div className="match-teams">
                <div className="team home">
                  <span className="team-name">{match.homeTeam?.teamName || 'TBD'}</span>
                </div>
                <div className="match-vs">
                  <span className="match-time">
                    {new Date(match.matchDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span className="match-date">
                    {new Date(match.matchDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="team away">
                  <span className="team-name">{match.awayTeam?.teamName || 'TBD'}</span>
                </div>
              </div>
              <div className="match-venue">
                <span className="venue-name">{match.venue?.venueName || 'TBD'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Showcase */}
      <div className="features-section">
        <h2 className="section-title">System Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Analytics</h3>
            <p>Advanced machine learning algorithms for match analysis and player performance prediction.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Tournament-Grade Security</h3>
            <p>Enterprise-level security with JWT authentication and role-based access control.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-Time Statistics</h3>
            <p>Live match data, player statistics, and comprehensive tournament analytics.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Automated Workflows</h3>
            <p>Streamlined processes for team registration, match scheduling, and tournament management.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>FIFA Management System</h4>
            <p>Professional football management platform</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <button onClick={() => onNavigate('teams')}>Teams</button>
              <button onClick={() => onNavigate('players')}>Players</button>
              <button onClick={() => onNavigate('matches')}>Matches</button>
              <button onClick={() => onNavigate('tournaments')}>Tournaments</button>
            </div>
          </div>
          <div className="footer-section">
            <h4>System Status</h4>
            <div className="status-indicators">
              <span className="status-indicator online">🟢 Online</span>
              <span className="status-indicator secure">🔒 Secure</span>
              <span className="status-indicator fast">⚡ Fast</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 FIFA Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
