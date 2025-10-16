import React, { useState, useEffect } from 'react';
import './App.css';

// Import components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Navigation from './components/Navigation/Navigation';
import TacticalAnalysis from './components/Tactics/TacticalAnalysis';
import MatchReports from './components/Reports/MatchReports';
import PressConferences from './components/Press/PressConferences';
import Dashboard from './components/Dashboard/Dashboard';
import TeamManagement from './components/Team/TeamManagement';
import PlayerManagement from './components/Player/PlayerManagement';
import AIDashboard from './components/AI/AIDashboard';
import SecurityDashboard from './components/Security/SecurityDashboard';
import HomePage from './components/Home/HomePage';
import MatchManagement from './components/Match/MatchManagement';
import Profile from './components/Profile/Profile';
import WelcomePage from './components/Home/WelcomePage';
import VenueManagement from './components/Venue/VenueManagement';
import OfficialManagement from './components/Official/OfficialManagement';
import UserManagement from './components/User/UserManagement';
import TournamentManagement from './components/Tournament/TournamentManagement';
import Settings from './components/Profile/Settings';
import ComingSoon from './components/Common/ComingSoon';
import PlayerStatistics from './components/Player/PlayerStatistics';
import NotificationsCenter from './components/Notifications/NotificationsCenter';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [navOpen, setNavOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);


  useEffect(() => {
    // Check for existing authentication
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    setShowRegister(false);
    // Show welcome banner once for first-time login if not verified
    try {
      const seen = localStorage.getItem('welcome_seen');
      if (!seen) {
        alert(`Welcome ${userData.username}! Please verify your email to unlock all features.`);
        localStorage.setItem('welcome_seen', '1');
      }
    } catch (_) {}
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setShowRegister(false);
    // Show login form after successful registration
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setCurrentView('home');
  };

  const toggleAuthMode = () => {
    setShowRegister(!showRegister);
  };

  useEffect(() => {
    const stored = sessionStorage.getItem('current_view');
    if (stored) setCurrentView(stored);
    const onPop = (e) => {
      const state = e.state;
      if (state && state.view) {
        setCurrentView(state.view);
        sessionStorage.setItem('current_view', state.view);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handleNavigation = (view) => {
    setCurrentView(view);
    sessionStorage.setItem('current_view', view);
    try { window.history.pushState({ view }, '', `#${view}`); } catch (_) {}
  };

  const renderCurrentView = () => {
    const canAccess = (role, view) => {
      const map = {
        'FIFA_ADMIN': ['dashboard','teams','players','matches','tournaments','venues','officials','users','analytics','security','profile','home','settings','reports'],
        'TEAM_MANAGER': ['dashboard','teams','players','matches','tactics','analytics','security','profile','home','settings','reports'],
        'COACH': ['dashboard','players','matches','tactics','profile','home','settings','reports'],
        'PLAYER': ['dashboard','matches','stats','profile','home','settings'],
        'TOURNAMENT_DIRECTOR': ['dashboard','tournaments','matches','venues','reports','analytics','security','profile','home','settings','reports'],
        'MATCH_OFFICIAL': ['dashboard','matches','reports','profile','home','settings'],
        'MEDIA_REPRESENTATIVE': ['dashboard','matches','teams','press','profile','home','settings'],
        'GUEST': ['home','matches','teams','profile','settings']
      };
      const allowed = map[user?.role] || ['home'];
      return allowed.includes(view);
    };
    const view = canAccess(user?.role, currentView) ? currentView : 'home';
    switch (view) {
      case 'home':
        return <HomePage user={user} token={token} onNavigate={handleNavigation} />;
      case 'dashboard':
        return <Dashboard user={user} token={token} />;
      case 'teams':
        return <TeamManagement token={token} />;
      case 'players':
        return <PlayerManagement token={token} />;
      case 'matches':
        return <MatchManagement token={token} />;
      case 'tournaments':
        return <TournamentManagement token={token} user={user} />;
      case 'venues':
        return <VenueManagement token={token} />;
      case 'officials':
        return <OfficialManagement token={token} />;
      case 'users':
        return <UserManagement token={token} />;
      case 'analytics':
        return <AIDashboard token={token} />;
      case 'security':
        return <SecurityDashboard token={token} />;
      case 'profile':
        return <Profile token={token} onSaved={() => {}} />;
      case 'notifications':
        return <NotificationsCenter token={token} user={user} />;
      case 'settings':
        return <Settings token={token} />;
      case 'stats':
        return <PlayerStatistics token={token} playerId={user?.playerId || user?.id} />;
      case 'tactics':
        return <TacticalAnalysis token={token} user={user} />;
      case 'reports':
        return <MatchReports token={token} user={user} />;
      case 'press':
        return <PressConferences user={user} />;
        default:
          return <HomePage user={user} token={token} onNavigate={handleNavigation} />;
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading FIFA Management System...</p>
      </div>
    );
  }
if (!user || !token) {
  if (showWelcome) {
    return (
      <WelcomePage
        onShowLogin={() => setShowWelcome(false)}
        onShowRegister={() => {
          setShowWelcome(false);
          setShowRegister(true);
        }}
      />
    );
  }

  return (
    <div className="app">
      {showRegister ? (
        <Register onRegister={handleRegister} toggleAuthMode={toggleAuthMode} />
      ) : (
        <Login onLogin={handleLogin} toggleAuthMode={toggleAuthMode} />
      )}
    </div>
  );
}


  return (
    <div className="app">
      <Navigation 
        user={user} 
        onNavigate={handleNavigation} 
        currentView={currentView}
        onToggle={(open) => setNavOpen(open)}
      />
      
      <div className="app-content" style={{ marginLeft: navOpen ? 0 : 280,transition:'margin-left 0.3 s' }}>
        <header className="app-header">
          <div className="header-content">
            <div className="header-left">
              <h1>⚽ FIFA Management System</h1>
              <p>Comprehensive Tournament & Team Management</p>
            </div>
            <div className="header-right">
              <button className="user-info" onClick={() => setCurrentView('profile')} title="View Profile">
                <span className="user-name">{user.username}</span>
                <span className="user-role">{user.role.replace('_', ' ')}</span>
              </button>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="app-main">
          {renderCurrentView()}
        </main>

        <footer className="app-footer">
          <p>&copy; 2024 FIFA Management System. All rights reserved.</p>
          <p>Built with Spring Boot & React.js</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
