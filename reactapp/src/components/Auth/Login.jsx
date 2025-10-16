import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Login = ({ onLogin,toggleAuthMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/auth/login', formData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      onLogin(user, token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={
      {
        display: 'flex',
        justifyContent: 'center',
        width: '100vw'
      }
    }>
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>welcome,⚽ FIFA Management System</h1>
          <p>Sign in to your account</p>
          </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">Username or password doesn't match with our records</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
  <p>
    Don't have an account?{' '}
    <span 
      onClick={toggleAuthMode} 
      style={{ color: '#667eea', cursor: 'pointer', fontWeight: 600 }}
    >
      Register here
    </span>
  </p>
</div>

      </div>
    </div>
    </div>
  );
};

export default Login;