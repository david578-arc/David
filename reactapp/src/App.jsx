import React, { useState, useEffect } from 'react';
import './App.css';

// Import components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Navigation from './components/Navigation/Navigation';
import Dashboard from './components/Dashboard/Dashboard';
import TeamManagement from './components/Team/TeamManagement';
import PlayerManagement from './components/Player/PlayerManagement';
import AIDashboard from './components/AI/AIDashboard';
import SecurityDashboard from './components/Security/SecurityDashboard';
import HomePage from './components/Home/HomePage';
import MatchManagement from './components/Match/MatchManagement';
//import Profile from './components/Profile/Profile';
import WelcomePage from './components/Home/WelcomePage';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');
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
    } catch (_) { }
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

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
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
        return <div className="coming-soon">Tournament Management - Coming Soon</div>;
      case 'venues':
        return <div className="coming-soon">Venue Management - Coming Soon</div>;
      case 'officials':
        return <div className="coming-soon">Official Management - Coming Soon</div>;
      case 'users':
        return <div className="coming-soon">User Management - Coming Soon</div>;
      case 'analytics':
        return <AIDashboard token={token} />;
      case 'security':
        return <SecurityDashboard token={token} />;
      //case 'profile':
      //return <Profile token={token} onSaved={() => { }} />;
      case 'stats':
        return <div className="coming-soon">Player Statistics - Coming Soon</div>;
      case 'tactics':
        return <div className="coming-soon">Tactical Analysis - Coming Soon</div>;
      case 'reports':
        return <div className="coming-soon">Match Reports - Coming Soon</div>;
      case 'press':
        return <div className="coming-soon">Press Conferences - Coming Soon</div>;
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
    />

    <div className="app-content">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>⚽ FIFA Management System</h1>
            <p>Comprehensive Tournament & Team Management</p>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              <span className="user-role">{user.role.replace('_', ' ')}</span>
            </div>
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
