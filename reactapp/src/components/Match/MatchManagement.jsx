import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MatchManagement.css';
import { getEndpoint } from '../../config/api';
import MatchStatistics from './MatchStatistics';
import TicketBooking from './TicketBooking';

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
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

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

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [matchesRes, teamsRes, venuesRes, officialsRes] = await Promise.all([
        axios.get(getEndpoint('MATCHES'), config),
        axios.get(getEndpoint('TEAMS'), config),
        axios.get(getEndpoint('VENUES'), config),
        axios.get(getEndpoint('OFFICIALS'), config)
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

  // ---------------- SUBMIT HANDLER ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const matchData = {
        ...formData,
        matchDate: new Date(`${formData.matchDate}T${formData.matchTime}`).toISOString()
      };

      if (editingMatch) {
        // Update match result
        await axios.put(
          getEndpoint('MATCH_RESULT', { id: editingMatch.id }),
          { homeScore: Number(homeScore), awayScore: Number(awayScore) },
          config
        );
      } else {
        // Create new match
        await axios.post(getEndpoint('MATCHES'), matchData, config);
      }

      setShowForm(false);
      setEditingMatch(null);
      resetForm();
      fetchData();
    } catch (err) {
      setError('Failed to save match: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
    setHomeScore('');
    setAwayScore('');
  };

  // ---------------- EDIT ----------------
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
    setHomeScore(match.homeScore ?? '');
    setAwayScore(match.awayScore ?? '');
    setShowForm(true);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (matchId) => {
    if (!window.confirm('Are you sure you want to delete this match?')) return;

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(getEndpoint('MATCH_BY_ID', { id: matchId }), config);
      fetchData();
    } catch (err) {
      setError('Failed to delete match: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UPDATE STATUS ----------------
  const handleUpdateStatus = async (matchId, newStatus) => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(getEndpoint('MATCH_BY_ID', { id: matchId }) + '/status', { status: newStatus }, config);
      fetchData();
    } catch (err) {
      setError('Failed to update match status: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FILTERING + SEARCH ----------------
  const filteredMatches = matches.filter((match) => {
    const matchStatus = filter === 'all' || match.status === filter;
    const matchSearch =
      searchTerm === '' ||
      match.homeTeam?.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam?.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.venue?.venueName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
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
  const getTeamName = (teamId) => {
  const team = teams.find(t => t.id === teamId);
  return team ? team.teamName : 'TBD';
};


  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ---------------- RENDER ----------------
  return (
    <div className="match-management">
      <div className="match-header">
        <h2>🏟️ Match Management</h2>
        <p>Manage matches, schedules, and officials</p>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      <div className="match-controls">
        <button className="add-match-btn" onClick={() => { setEditingMatch(null); setShowForm(true); }}>
          ➕ Add Match
        </button>

        <div className="search-filter-controls">
          <input
            type="text"
            placeholder="Search matches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="LIVE">Live</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="POSTPONED">Postponed</option>
          </select>
        </div>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="match-form-overlay">
          <div className="match-form">
            <h3>{editingMatch ? 'Edit Match' : 'Add New Match'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Home/Away Teams */}
                <div className="form-group">
                  <label>Home Team</label>
                  <select required value={formData.homeTeamId}
                    onChange={(e) => setFormData({ ...formData, homeTeamId: e.target.value })}>
                    <option value="">Select</option>
                    {teams.map((team) => <option key={team.id} value={team.id}>{team.teamName}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Away Team</label>
                  <select required value={formData.awayTeamId}
                    onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}>
                    <option value="">Select</option>
                    {teams.map((team) => <option key={team.id} value={team.id}>{team.teamName}</option>)}
                  </select>
                </div>

                {/* Scores */}
                <div className="form-group"><label>Home Score</label>
                  <input type="number" min="0" value={homeScore} onChange={(e) => setHomeScore(e.target.value)} />
                </div>
                <div className="form-group"><label>Away Score</label>
                  <input type="number" min="0" value={awayScore} onChange={(e) => setAwayScore(e.target.value)} />
                </div>

                {/* Venue & Date */}
                <div className="form-group">
                  <label>Venue</label>
                  <select required value={formData.venueId}
                    onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}>
                    <option value="">Select</option>
                    {venues.map((v) => <option key={v.id} value={v.id}>{v.venueName}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" required value={formData.matchDate}
                    onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" required value={formData.matchTime}
                    onChange={(e) => setFormData({ ...formData, matchTime: e.target.value })} />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Match'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MATCH CARDS */}
      <div className="matches-grid">
        {loading && <div className="loading">Loading matches...</div>}

        {!loading && filteredMatches.length > 0 && filteredMatches.map((match) => (
          <div key={match.id} className="match-card">
            <div className="match-card-header">
              <div className="match-teams">
               <span>{getTeamName(match.homeTeamId?.id)}</span>
                 <span className="vs">vs</span>
                <span>{getTeamName(match.awayTeamId?.id)}</span>
              </div>

              <span className={`status-badge ${getStatusColor(match.status)}`}>{match.status}</span>
            </div>
            <div className="match-card-body">
              <p><strong>📅</strong> {formatMatchDate(match.matchDate)}</p>
              <p><strong>📍</strong> {match.venue?.venueName || 'TBD'}</p>
              {match.referee && <p><strong>👨‍⚖️</strong> {match.referee.name}</p>}

              <div className="actions">
                <button onClick={() => handleEdit(match)}>✏️ Edit</button>
                {match.status === 'SCHEDULED' && (
                  <button onClick={() => handleUpdateStatus(match.id, 'LIVE')}>▶️ Start</button>
                )}
                {match.status === 'LIVE' && (
                  <button onClick={() => handleUpdateStatus(match.id, 'COMPLETED')}>✅ End</button>
                )}
                <button className="danger" onClick={() => handleDelete(match.id)}>🗑️ Delete</button>
              </div>
            </div>

            <MatchStatistics matchId={match.id} />
            <TicketBooking token={token} matchId={match.id} />
          </div>
        ))}

        {!loading && filteredMatches.length === 0 && (
          <div className="empty">No matches found.</div>
        )}
      </div>
    </div>
  );
};

export default MatchManagement;
