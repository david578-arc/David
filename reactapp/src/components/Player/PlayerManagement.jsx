import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getEndpoint } from '../../config/api';
import './PlayerManagement.css';

const PlayerManagement = ({ token }) => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [filters, setFilters] = useState({
    position: '',
    nationality: '',
    team: ''
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    position: '',
    teamId: '',
    jerseyNumber: '',
    dateOfBirth: '',
    nationality: '',
    capsEarned: '',
    goalsScored: '',
    clubAffiliation: '',
    medicalClearance: false,
    isAvailable: true
  });
 const getTeamName = (player) => { console.log('Player data:', player); 

    if (player.team && player.team.teamName) {
      return player.team.teamName;
    }
    // Check for teamId or similar field
    const teamId = player.teamId || (player.team ? player.team.id : null);
    if (teamId && teams.length > 0) {
      const team = teams.find(t => t.id.toString() === teamId.toString());
      return team ? team.teamName : 'No Team';
    }
    return 'No Team';
  };
  useEffect(() => {
    fetchTeams();
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(getEndpoint('PLAYERS'), config);
      setPlayers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch players: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(getEndpoint('TEAMS'), config);
      setTeams(response.data);
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    }
  };


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const playerData = {
        ...formData,
        teamId: formData.teamId ? parseInt(formData.teamId) : null,
        jerseyNumber: formData.jerseyNumber ? parseInt(formData.jerseyNumber) : null,
        capsEarned: formData.capsEarned ? parseInt(formData.capsEarned) : 0,
        goalsScored: formData.goalsScored ? parseInt(formData.goalsScored) : 0
      };

      if (editingPlayer) {
        await axios.put(getEndpoint('PLAYER_BY_ID', { id: editingPlayer.id }), playerData, config);
      } else {
        await axios.post(getEndpoint('PLAYERS'), playerData, config);
      }

      await fetchPlayers();
      resetForm();
      setError('');
    } catch (err) {
      setError('Failed to save player: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setFormData({
      firstName: player.firstName || '',
      lastName: player.lastName || '',
      position: player.position || '',
      teamId: player.teamId.toString() || '',
      jerseyNumber: player.jerseyNumber?.toString() || '',
      dateOfBirth: player.dateOfBirth || '',
      nationality: player.nationality || '',
      capsEarned: player.capsEarned?.toString() || '',
      goalsScored: player.goalsScored?.toString() || '',
      clubAffiliation: player.clubAffiliation || '',
      medicalClearance: player.medicalClearance || false,
      isAvailable: player.isAvailable !== false
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        setLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        await axios.delete(getEndpoint('PLAYER_BY_ID', { id }), config);
        await fetchPlayers();
        setError('');
      } catch (err) {
        setError('Failed to delete player: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      position: '',
      teamId: '',
      jerseyNumber: '',
      dateOfBirth: '',
      nationality: '',
      capsEarned: '',
      goalsScored: '',
      clubAffiliation: '',
      medicalClearance: false,
      isAvailable: true
    });
    setEditingPlayer(null);
    setShowAddForm(false);
  };

  const getPositionColor = (position) => {
    const colors = {
      'Goalkeeper': '#FF6B6B',
      'Defender': '#4ECDC4',
      'Midfielder': '#45B7D1',
      'Forward': '#96CEB4',
      'Striker': '#FFEAA7'
    };
    return colors[position] || '#DDA0DD';
  };

  const filteredPlayers = players.filter(player => {
    return (
      (!filters.position || player.position === filters.position) &&
      (!filters.nationality || player.nationality?.toLowerCase().includes(filters.nationality.toLowerCase())) &&
      (!filters.team || player.team?.id?.toString() === filters.team)
    );
  });

  return (
    <div className="player-management">
      <div className="page-header">
        <h2>Player Management</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-button"
        >
          {showAddForm ? 'Cancel' : '+ Add New Player'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-controls">
          <select
            name="position"
            value={filters.position}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Positions</option>
            <option value="Goalkeeper">Goalkeeper</option>
            <option value="Defender">Defender</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Forward">Forward</option>
            <option value="Striker">Striker</option>
          </select>

          <input
            type="text"
            name="nationality"
            placeholder="Filter by nationality..."
            value={filters.nationality}
            onChange={handleFilterChange}
            className="filter-input"
          />

          <select
            name="team"
            value={filters.team}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Teams</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showAddForm && (
        <div className="form-container">
          <h3>{editingPlayer ? 'Edit Player' : 'Add New Player'}</h3>
          <form onSubmit={handleSubmit} className="player-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Position</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Position</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Defender">Defender</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Forward">Forward</option>
                  <option value="Striker">Striker</option>
                </select>
              </div>
              <div className="form-group">
                <label>Team</label>
                <select
                  name="teamId"
                  value={formData.teamId}
                  onChange={handleInputChange}
                >
                  <option value="">Select Team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.teamName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Jersey Number</label>
                <input
                  type="number"
                  name="jerseyNumber"
                  value={formData.jerseyNumber}
                  onChange={handleInputChange}
                  min="1"
                  max="99"
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Club Affiliation</label>
                <input
                  type="text"
                  name="clubAffiliation"
                  value={formData.clubAffiliation}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>International Caps</label>
                <input
                  type="number"
                  name="capsEarned"
                  value={formData.capsEarned}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Goals Scored</label>
                <input
                  type="number"
                  name="goalsScored"
                  value={formData.goalsScored}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="medicalClearance"
                    checked={formData.medicalClearance}
                    onChange={handleInputChange}
                  />
                  Medical Clearance
                </label>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                  />
                  Available for Selection
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (editingPlayer ? 'Update Player' : 'Add Player')}
              </button>
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="players-grid">
        {filteredPlayers.map(player => (
          <div key={player.id} className="player-card">
            <div 
              className="position-badge"
              style={{ backgroundColor: getPositionColor(player.position) }}
            >
              {player.position}
            </div>
            
            <div className="player-info">
              <h3>{player.playerName}</h3>
             <p className="team">{getTeamName(player)}</p>
              <p className="nationality">🇺🇳 {player.nationality}</p>
              
              <div className="player-stats">
                <span>#{player.jerseyNumber || 'N/A'}</span>
                <span>Age: {player.age}</span>
                <span>Goals: {player.goalsScored || 0}</span>
                <span>Caps: {player.capsEarned || 0}</span>
              </div>

              <div className="player-status">
                <span className={`status ${player.medicalClearance ? 'cleared' : 'pending'}`}>
                  Medical: {player.medicalClearance ? 'Cleared' : 'Pending'}
                </span>
                <span className={`status ${player.isAvailable ? 'available' : 'unavailable'}`}>
                  {player.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <div className="player-actions">
              <button 
                onClick={() => handleEdit(player)}
                className="edit-btn"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(player.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default PlayerManagement;
