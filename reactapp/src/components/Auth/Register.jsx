import React, { useState } from 'react';
import axios from 'axios';
import { getEndpoint } from '../../config/api';
import './Auth.css';

const Register = ({ onRegister,toggleAuthMode }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'PLAYER',
    fifaId: '',
    confederation: '',
    team: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { value: 'GUEST', label: 'Guest' },
    { value: 'PLAYER', label: 'Player' },
    { value: 'COACH', label: 'Coach' },
    { value: 'TEAM_MANAGER', label: 'Team Manager' },
    { value: 'TOURNAMENT_DIRECTOR', label: 'Tournament Director' },
    { value: 'FIFA_ADMIN', label: 'FIFA Admin' },
    { value: 'MATCH_OFFICIAL', label: 'Match Official' },
    { value: 'MEDIA_REPRESENTATIVE', label: 'Media Representative' }
  ];

  const confederations = [
    'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'
  ];

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
      const payload = { ...formData };
      if (payload.role === 'GUEST') {
        payload.fifaId = '';
        payload.team = '';
      }
      const url = getEndpoint('REGISTER');
      const response = await axios.post(url, payload);
      const { user } = response.data;
      
      onRegister(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          <h1>⚽ FIFA Management System</h1>
          <p>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
              />
            </div>
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
              placeholder="Enter password"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="confederation">Confederation</label>
              <select
                id="confederation"
                name="confederation"
                value={formData.confederation}
                onChange={handleChange}
              >
                <option value="">Select Confederation</option>
                {confederations.map(conf => (
                  <option key={conf} value={conf}>
                    {conf}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            {formData.role !== 'GUEST' && (
              <>
                <div className="form-group">
                  <label htmlFor="fifaId">FIFA ID</label>
                  <input
                    type="text"
                    id="fifaId"
                    name="fifaId"
                    value={formData.fifaId}
                    onChange={handleChange}
                    placeholder="Enter FIFA ID"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="team">Team</label>
                  <input
                    type="text"
                    id="team"
                    name="team"
                    value={formData.team}
                    onChange={handleChange}
                    placeholder="Enter team name"
                  />
                </div>
              </>
            )}
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

       <div className="auth-footer">
     <p>
        Already have an account?{' '}
     <span 
      onClick={toggleAuthMode} 
      style={{ color: '#667eea', cursor: 'pointer', fontWeight: 600 }}
      >
      Sign in here
      </span>
    </p>
    </div>


      </div>
    </div>
    </div>
  );
};

export default Register;

