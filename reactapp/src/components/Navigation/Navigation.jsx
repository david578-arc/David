import React, { useState } from 'react';
import './Navigation.css';

const Navigation = ({ user, onNavigate, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'home', label: 'Home', icon: '🏠' },
      { id: 'dashboard', label: 'Dashboard', icon: '📊' }
    ];

    switch (user.role) {
      case 'FIFA_ADMIN':
        return [
          ...baseItems,
          { id: 'teams', label: 'Team Management', icon: '⚽' },
          { id: 'players', label: 'Player Management', icon: '👤' },
          { id: 'matches', label: 'Match Management', icon: '🏟️' },
          { id: 'tournaments', label: 'Tournament Management', icon: '🏆' },
          { id: 'venues', label: 'Venue Management', icon: '📍' },
          { id: 'officials', label: 'Official Management', icon: '👨‍⚖️' },
          { id: 'users', label: 'User Management', icon: '👥' },
          { id: 'analytics', label: 'AI & Analytics', icon: '🤖' },
          { id: 'security', label: 'Security & Maintenance', icon: '🔒' }
        ];
      
      case 'TEAM_MANAGER':
        return [
          ...baseItems,
          { id: 'teams', label: 'My Team', icon: '⚽' },
          { id: 'players', label: 'Player Management', icon: '👤' },
          { id: 'matches', label: 'Team Matches', icon: '🏟️' },
          { id: 'analytics', label: 'AI Analytics', icon: '🤖' },
          { id: 'security', label: 'Security & Maintenance', icon: '🔒' }
        ];
      
      case 'COACH':
        return [
          ...baseItems,
          { id: 'players', label: 'Player Selection', icon: '👤' },
          { id: 'matches', label: 'Match Preparation', icon: '🏟️' },
          { id: 'tactics', label: 'Tactical Analysis', icon: '📋' }
        ];
      
      case 'PLAYER':
        return [
          ...baseItems,
          { id: 'profile', label: 'My Profile', icon: '👤' },
          { id: 'matches', label: 'My Matches', icon: '🏟️' },
          { id: 'stats', label: 'My Statistics', icon: '📊' }
        ];
      
      case 'TOURNAMENT_DIRECTOR':
        return [
          ...baseItems,
          { id: 'tournaments', label: 'Tournament Management', icon: '🏆' },
          { id: 'matches', label: 'Match Scheduling', icon: '🏟️' },
          { id: 'venues', label: 'Venue Management', icon: '📍' },
          { id: 'analytics', label: 'AI Analytics', icon: '🤖' },
          { id: 'security', label: 'Security & Maintenance', icon: '🔒' }
        ];
      
      case 'MATCH_OFFICIAL':
        return [
          ...baseItems,
          { id: 'matches', label: 'My Matches', icon: '🏟️' },
          { id: 'reports', label: 'Match Reports', icon: '📋' }
        ];
      
      case 'MEDIA_REPRESENTATIVE':
        return [
          ...baseItems,
          { id: 'matches', label: 'Match Information', icon: '🏟️' },
          { id: 'teams', label: 'Team Information', icon: '⚽' },
          { id: 'press', label: 'Press Conferences', icon: '📰' }
        ];
      
      default:
        return [
          ...baseItems,
          { id: 'matches', label: 'Match Schedule', icon: '🏟️' },
          { id: 'teams', label: 'Teams', icon: '⚽' }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (itemId) => {
    onNavigate(itemId);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navigation">
      <div className="nav-header">
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
                <span className="nav-icon">{item.icon}</span>
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
