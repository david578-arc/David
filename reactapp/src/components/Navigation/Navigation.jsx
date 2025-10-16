import React, { useState } from 'react';
import './Navigation.css';

const Icon = ({ name }) => {
  switch (name) {
    case 'home':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 'dashboard':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h5v8H3v-8zm7 5h11v3H10v-3z" fill="currentColor" />
        </svg>
      );
    case 'teams':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M7 7a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm-4 12a6 6 0 1 1 12 0H3zM16 9h3m-1.5-1.5V10.5M18 17h3v4h-3v-4z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'players':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 20a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'matches':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 8l6 6M15 8l-6 6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'tournaments':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 3h8v3a4 4 0 0 0 4 4h1v2a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7V10h1a4 4 0 0 0 4-4V3z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'venues':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 2l7 7-7 13L5 9l7-7z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <circle cx="12" cy="9" r="2" fill="currentColor" />
        </svg>
      );
    case 'officials':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 7h8M8 11h8M8 15h8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'users':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 21a5 5 0 0 1 10 0M11 21a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
      case 'reports':
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M8 8h8M8 12h5M8 16h3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );

case 'settings':
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.1a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.1a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.1A1.65 1.65 0 0 0 9 3.1V3a2 2 0 0 1 4 0v.1a1.65 1.65 0 0 0 1 1.51h.1a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.1a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.1a1.65 1.65 0 0 0-1.5 1z"
            stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );

    case 'analytics':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M4 20V10m6 10V4m6 16v-7m4 7H2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'security':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
};

const Navigation = ({ user, onNavigate, currentView, onToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

 const getNavigationItems = () => {
  const baseItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }
  ];

  switch (user.role) {
    case 'FIFA_ADMIN':
      return [
        ...baseItems,
        { id: 'teams', label: 'Team Management', icon: 'teams' },
        { id: 'players', label: 'Player Management', icon: 'players' },
        { id: 'matches', label: 'Match Management', icon: 'matches' },
        { id: 'tournaments', label: 'Tournament Management', icon: 'tournaments' },
        { id: 'venues', label: 'Venue Management', icon: 'venues' },
        { id: 'officials', label: 'Official Management', icon: 'officials' },
        { id: 'users', label: 'User Management', icon: 'users' },
        { id: 'analytics', label: 'AI & Analytics', icon: 'analytics' },
        { id: 'security', label: 'Security & Maintenance', icon: 'security' },
        { id: 'reports', label: 'Reports', icon: 'reports' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
      ];

    case 'TEAM_MANAGER':
      return [
        ...baseItems,
        { id: 'teams', label: 'My Team', icon: 'teams' },
        { id: 'players', label: 'Player Management', icon: 'players' },
        { id: 'matches', label: 'Team Matches', icon: 'matches' },
        { id: 'tactics', label: 'Tactical Analysis', icon: 'dashboard' },
        { id: 'analytics', label: 'AI Analytics', icon: 'analytics' },
        { id: 'security', label: 'Security & Maintenance', icon: 'security' },
        { id: 'reports', label: 'Reports', icon: 'reports' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
      ];

    case 'COACH':
      return [
        ...baseItems,
        { id: 'players', label: 'Player Selection', icon: 'players' },
        { id: 'matches', label: 'Match Preparation', icon: 'matches' },
        { id: 'tactics', label: 'Tactical Analysis', icon: 'dashboard' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
      ];

    case 'PLAYER':
      return [
        ...baseItems,
        { id: 'profile', label: 'My Profile', icon: 'profile' },
        { id: 'matches', label: 'My Matches', icon: 'matches' },
        { id: 'stats', label: 'My Statistics', icon: 'dashboard' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
      ];


    case 'TOURNAMENT_DIRECTOR':
      return [
        ...baseItems,
        { id: 'tournaments', label: 'Tournament Management', icon: 'tournaments' },
        { id: 'matches', label: 'Match Scheduling', icon: 'matches' },
        { id: 'venues', label: 'Venue Management', icon: 'venues' },
        { id: 'analytics', label: 'AI Analytics', icon: 'analytics' },
        { id: 'security', label: 'Security & Maintenance', icon: 'security' },
        { id: 'reports', label: 'Reports', icon: 'reports' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
      ];

    case 'MATCH_OFFICIAL':
      return [
        ...baseItems,
        { id: 'matches', label: 'My Matches', icon: 'matches' },
        { id: 'reports', label: 'Match Reports', icon: 'reports' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
      ];

    case 'MEDIA_REPRESENTATIVE':
      return [
        ...baseItems,
        { id: 'matches', label: 'Match Information', icon: 'matches' },
        { id: 'teams', label: 'Team Information', icon: 'teams' },
        { id: 'press', label: 'Press Conferences', icon: 'dashboard' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
      ];

    default:
      return [
        ...baseItems,
        { id: 'matches', label: 'Match Schedule', icon: 'matches' },
        { id: 'teams', label: 'Teams', icon: 'teams' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
      ];
  }
};

   

  const navigationItems = getNavigationItems();

  const handleNavigation = (itemId) => {
    onNavigate(itemId);
    setIsMenuOpen(false);
    onToggle && onToggle(false);
  };

  return (
    <nav className={`navigation ${isMenuOpen ? 'open' : ''}`}>
      <div className="nav-header">
        <button
          className="menu-toggle"
          onClick={() => { const next = !isMenuOpen; setIsMenuOpen(next); onToggle && onToggle(next); }}
        >
          ☰
        </button>
        <h3>FIFA Management</h3>
      </div>

      <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="user-info">
          <div className="user-avatar">
            {user.role === 'FIFA_ADMIN' ? '👑' :
              user.role === 'TEAM_MANAGER' ? '⚽' :
                user.role === 'COACH' ? '📋' :
                  user.role === 'PLAYER' ? '👤' :
                    user.role === 'TOURNAMENT_DIRECTOR' ? '🏆' :
                      user.role === 'MATCH_OFFICIAL' ? '👨‍⚖️' :
                        user.role === 'MEDIA_REPRESENTATIVE' ? '📰' : '👤'}
          </div>
          <div className="user-details">
            <span className="user-name">{user.username}</span>
            <span className="user-role">{user.role.replace('_', ' ')}</span>
          </div>
        </div>

        <ul className="nav-items">
          {navigationItems.map(item => (
            <li key={item.id}>
              <button
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => handleNavigation(item.id)}
              >
                <span className="nav-icon"><Icon name={item.icon} /></span>
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;