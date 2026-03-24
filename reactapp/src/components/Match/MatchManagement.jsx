import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MatchManagement.css';

const MatchManagement = ({ token }) => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    homeTeamId: '',
    awayTeamId: '',
    venueId: '',
    matchDate: '',
    matchTime: '',
    status: 'SCHEDULED',
    refereeId: '',
    assistantReferee1Id: '',
    assistantReferee2Id: '',
    fourthOfficialId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [matchesRes, teamsRes, venuesRes, officialsRes] = await Promise.all([
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches', config),
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/teams', config),
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/venues', config),
        axios.get('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/officials', config)
      ]);

      setMatches(matchesRes.data);
      setTeams(teamsRes.data);
      setVenues(venuesRes.data);
      setOfficials(officialsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch data: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const matchData = {
        ...formData,
        matchDate: new Date(`${formData.matchDate}T${formData.matchTime}`).toISOString()
      };

      if (editingMatch) {
        await axios.put(`https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches/${editingMatch.id}`, matchData, config);
      } else {
        await axios.post('https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches', matchData, config);
      }

      setShowForm(false);
      setEditingMatch(null);
      setFormData({
        homeTeamId: '',
        awayTeamId: '',
        venueId: '',
        matchDate: '',
        matchTime: '',
        status: 'SCHEDULED',
        refereeId: '',
        assistantReferee1Id: '',
        assistantReferee2Id: '',
        fourthOfficialId: ''
      });
      fetchData();
    } catch (err) {
      setError('Failed to save match: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (match) => {
    setEditingMatch(match);
    setFormData({
      homeTeamId: match.homeTeam?.id || '',
      awayTeamId: match.awayTeam?.id || '',
      venueId: match.venue?.id || '',
      matchDate: match.matchDate ? new Date(match.matchDate).toISOString().split('T')[0] : '',
      matchTime: match.matchDate ? new Date(match.matchDate).toTimeString().slice(0, 5) : '',
      status: match.status,
      refereeId: match.referee?.id || '',
      assistantReferee1Id: match.assistantReferee1?.id || '',
      assistantReferee2Id: match.assistantReferee2?.id || '',
      fourthOfficialId: match.fourthOfficial?.id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (matchId) => {
    if (!window.confirm('Are you sure you want to delete this match?')) return;

    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.delete(`https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches/${matchId}`, config);
      fetchData();
    } catch (err) {
      setError('Failed to delete match: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (matchId, newStatus) => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put(`https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/matches/${matchId}/status`, 
        { status: newStatus }, config);
      fetchData();
    } catch (err) {
      setError('Failed to update match status: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match => {
    const matchesFilter = filter === 'all' || match.status === filter;
    const matchesSearch = searchTerm === '' || 
      match.homeTeam?.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam?.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.venue?.venueName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'scheduled';
      case 'LIVE': return 'live';
      case 'COMPLETED': return 'completed';
      case 'CANCELLED': return 'cancelled';
      case 'POSTPONED': return 'postponed';
      default: return 'scheduled';
    }
  };

  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="match-management">
      <div className="match-header">
        <h2>🏟️ Match Management</h2>
        <p>Manage matches, schedules, and match officials</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="match-controls">
        <div className="control-group">
          <button 
            className="add-match-btn"
            onClick={() => {
              setEditingMatch(null);
              setShowForm(true);
            }}
          >
            ➕ Add New Match
          </button>
        </div>

        <div className="filter-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search matches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Matches</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="LIVE">Live</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="POSTPONED">Postponed</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="match-form-overlay">
          <div className="match-form">
            <div className="form-header">
              <h3>{editingMatch ? 'Edit Match' : 'Add New Match'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingMatch(null);
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Home Team</label>
                  <select
                    value={formData.homeTeamId}
                    onChange={(e) => setFormData({...formData, homeTeamId: e.target.value})}
                    required
                  >
                    <option value="">Select Home Team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.teamName}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Away Team</label>
                  <select
                    value={formData.awayTeamId}
                    onChange={(e) => setFormData({...formData, awayTeamId: e.target.value})}
                    required
                  >
                    <option value="">Select Away Team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.teamName}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Venue</label>
                  <select
                    value={formData.venueId}
                    onChange={(e) => setFormData({...formData, venueId: e.target.value})}
                    required
                  >
                    <option value="">Select Venue</option>
                    {venues.map(venue => (
                      <option key={venue.id} value={venue.id}>{venue.venueName}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Match Date</label>
                  <input
                    type="date"
                    value={formData.matchDate}
                    onChange={(e) => setFormData({...formData, matchDate: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Match Time</label>
                  <input
                    type="time"
                    value={formData.matchTime}
                    onChange={(e) => setFormData({...formData, matchTime: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="LIVE">Live</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="POSTPONED">Postponed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Referee</label>
                  <select
                    value={formData.refereeId}
                    onChange={(e) => setFormData({...formData, refereeId: e.target.value})}
                  >
                    <option value="">Select Referee</option>
                    {officials.filter(official => official.officialType === 'REFEREE').map(official => (
                      <option key={official.id} value={official.id}>{official.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Assistant Referee 1</label>
                  <select
                    value={formData.assistantReferee1Id}
                    onChange={(e) => setFormData({...formData, assistantReferee1Id: e.target.value})}
                  >
                    <option value="">Select Assistant Referee</option>
                    {officials.filter(official => official.officialType === 'ASSISTANT_REFEREE').map(official => (
                      <option key={official.id} value={official.id}>{official.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Assistant Referee 2</label>
                  <select
                    value={formData.assistantReferee2Id}
                    onChange={(e) => setFormData({...formData, assistantReferee2Id: e.target.value})}
                  >
                    <option value="">Select Assistant Referee</option>
                    {officials.filter(official => official.officialType === 'ASSISTANT_REFEREE').map(official => (
                      <option key={official.id} value={official.id}>{official.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Fourth Official</label>
                  <select
                    value={formData.fourthOfficialId}
                    onChange={(e) => setFormData({...formData, fourthOfficialId: e.target.value})}
                  >
                    <option value="">Select Fourth Official</option>
                    {officials.filter(official => official.officialType === 'FOURTH_OFFICIAL').map(official => (
                      <option key={official.id} value={official.id}>{official.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : (editingMatch ? 'Update Match' : 'Create Match')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="matches-container">
        {loading && !showForm ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading matches...</p>
          </div>
        ) : (
          <div className="matches-grid">
            {filteredMatches.map(match => (
              <div key={match.id} className="match-card">
                <div className="match-header-card">
                  <div className="match-teams">
                    <div className="team home">
                      <span className="team-name">{match.homeTeam?.teamName || 'TBD'}</span>
                    </div>
                    <div className="match-vs">
                      <span className="vs-text">VS</span>
                      {match.status === 'COMPLETED' && match.homeScore !== null && match.awayScore !== null && (
                        <span className="match-score">
                          {match.homeScore} - {match.awayScore}
                        </span>
                      )}
                    </div>
                    <div className="team away">
                      <span className="team-name">{match.awayTeam?.teamName || 'TBD'}</span>
                    </div>
                  </div>
                  
                  <div className="match-status">
                    <span className={`status-badge ${getStatusColor(match.status)}`}>
                      {match.status}
                    </span>
                  </div>
                </div>

                <div className="match-details">
                  <div className="match-info">
                    <div className="info-item">
                      <span className="info-label">📅 Date & Time:</span>
                      <span className="info-value">{formatMatchDate(match.matchDate)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📍 Venue:</span>
                      <span className="info-value">{match.venue?.venueName || 'TBD'}</span>
                    </div>
                    {match.referee && (
                      <div className="info-item">
                        <span className="info-label">👨‍⚖️ Referee:</span>
                        <span className="info-value">{match.referee.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="match-actions">
                    <button 
                      onClick={() => handleEdit(match)}
                      className="action-btn edit"
                    >
                      ✏️ Edit
                    </button>
                    
                    <div className="status-actions">
                      {match.status === 'SCHEDULED' && (
                        <button 
                          onClick={() => handleUpdateStatus(match.id, 'LIVE')}
                          className="action-btn live"
                        >
                          ▶️ Start Match
                        </button>
                      )}
                      {match.status === 'LIVE' && (
                        <button 
                          onClick={() => handleUpdateStatus(match.id, 'COMPLETED')}
                          className="action-btn complete"
                        >
                          ✅ End Match
                        </button>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(match.id)}
                      className="action-btn delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredMatches.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🏟️</div>
            <h3>No matches found</h3>
            <p>Create your first match or adjust your search criteria.</p>
            <button 
              className="add-first-match-btn"
              onClick={() => {
                setEditingMatch(null);
                setShowForm(true);
              }}
            >
              ➕ Add First Match
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchManagement;
