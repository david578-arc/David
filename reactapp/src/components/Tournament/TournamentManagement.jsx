import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TournamentManagement.css';
import { getEndpoint } from '../../config/api';

const TournamentManagement = ({ token, user }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: 'ALL', sort: 'tournamentName_asc' });
  const [showForm, setShowForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);

  const [formData, setFormData] = useState({
    tournamentName: '',
    hostCountry: '',
    startDate: '',
    endDate: '',
    edition: '',
    status: 'UPCOMING'
  });

  const isPrivileged =
    user && (user.role === 'FIFA_ADMIN' || user.role === 'TOURNAMENT_DIRECTOR');

  useEffect(() => {
    fetchTournaments();
  }, [filters]);

  // ------------------ FETCH TOURNAMENTS ------------------
  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      let url = getEndpoint('TOURNAMENTS');

      if (filters.status && filters.status !== 'ALL') {
        if (filters.status === 'ACTIVE') url = getEndpoint('TOURNAMENT_ACTIVE');
        else if (filters.status === 'UPCOMING') url = getEndpoint('TOURNAMENT_UPCOMING');
        else url = getEndpoint('TOURNAMENT_STATUS', { status: filters.status });
      }

      const res = await axios.get(url, config);
      let data = res.data;

      // Apply sorting
      if (filters.sort) {
        const [field, dir] = filters.sort.split('_');
        data = [...data].sort((a, b) => {
          let valA = a[field] || '';
          let valB = b[field] || '';
          if (field.includes('Date')) {
            valA = new Date(valA);
            valB = new Date(valB);
          }
          if (valA < valB) return dir === 'asc' ? -1 : 1;
          if (valA > valB) return dir === 'asc' ? 1 : -1;
          return 0;
        });
      }

      setTournaments(data);
      setError('');
    } catch (e) {
      setError('Failed to load tournaments: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  // ------------------ HANDLE FORM ------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      tournamentName: '',
      hostCountry: '',
      startDate: '',
      endDate: '',
      edition: '',
      status: 'UPCOMING'
    });
    setEditingTournament(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPrivileged) return;

    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingTournament) {
        // Update existing tournament
        const url = getEndpoint('TOURNAMENT_BY_ID', { id: editingTournament.id });
        await axios.put(url, formData, config);
      } else {
        // Add new tournament
        const url = getEndpoint('TOURNAMENTS');
        await axios.post(url, formData, config);
      }

      fetchTournaments();
      resetForm();
    } catch (e) {
      setError('Failed to save tournament: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  // ------------------ DELETE TOURNAMENT ------------------
  const handleDelete = async (id) => {
    if (!isPrivileged) return;
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const url = getEndpoint('TOURNAMENT_BY_ID', { id });
      await axios.delete(url, config);
      fetchTournaments();
    } catch (e) {
      setError('Failed to delete tournament: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  // ------------------ ADVANCE TOURNAMENT ------------------
  const handleAdvance = async (id) => {
    if (!isPrivileged) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const url = getEndpoint('TOURNAMENT_ADVANCE', { id });
      await axios.put(url, {}, config);
      fetchTournaments();
    } catch (e) {
      setError('Failed to advance tournament: ' + (e.response?.data?.message || e.message));
    }
  };

  // ------------------ EDIT ------------------
  const handleEdit = (t) => {
    setEditingTournament(t);
    setFormData({
      tournamentName: t.tournamentName || '',
      hostCountry: t.hostCountry || '',
      startDate: t.startDate?.split('T')[0] || '',
      endDate: t.endDate?.split('T')[0] || '',
      edition: t.edition || '',
      status: t.status || 'UPCOMING'
    });
    setShowForm(true);
  };

  return (
    <div className="tournament-management">
      <div className="tm-header">
        <h2>🏆 Tournament Management</h2>

        <div className="tm-controls">
          <label>
            Status:
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="ALL">All</option>
              <option value="ACTIVE">Active</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>

          <label>
            Sort by:
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value="tournamentName_asc">Name (A–Z)</option>
              <option value="tournamentName_desc">Name (Z–A)</option>
              <option value="startDate_asc">Start Date ↑</option>
              <option value="startDate_desc">Start Date ↓</option>
              <option value="status_asc">Status (A–Z)</option>
            </select>
          </label>

          <button className="btn" onClick={fetchTournaments}>
            Refresh
          </button>

          {isPrivileged && (
            <button className="btn primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add Tournament'}
            </button>
          )}
        </div>
      </div>

      {error && <div className="tm-error">{error}</div>}

      {/* ------------------ FORM ------------------ */}
      {showForm && (
        <div className="tm-form-container">
          <h3>{editingTournament ? 'Edit Tournament' : 'Add Tournament'}</h3>
          <form className="tm-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Tournament Name</label>
                <input
                  name="tournamentName"
                  value={formData.tournamentName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Host Country</label>
                <input
                  name="hostCountry"
                  value={formData.hostCountry}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Edition</label>
                <input
                  name="edition"
                  value={formData.edition}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading
                  ? 'Saving...'
                  : editingTournament
                    ? 'Update Tournament'
                    : 'Add Tournament'}
              </button>
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ------------------ TOURNAMENT CARDS ------------------ */}
      <div className="tm-grid">
        {loading && <div className="tm-loading">Loading tournaments…</div>}

        {!loading &&
          tournaments.map((t) => (
            <div key={t.id} className="tm-card">
              <div className="tm-card-header">
                <h4>{t.tournamentName}</h4>
                <span className={`tm-status ${t.status?.toLowerCase()}`}>
                  {t.status}
                </span>
              </div>
              <div className="tm-card-body">
                <div><strong>Host:</strong> {t.hostCountry || 'N/A'}</div>
                <div><strong>Edition:</strong> {t.edition || 'N/A'}</div>
                <div><strong>Start:</strong> {t.startDate ? new Date(t.startDate).toLocaleDateString() : 'N/A'}</div>
                <div><strong>End:</strong> {t.endDate ? new Date(t.endDate).toLocaleDateString() : 'N/A'}</div>

                {isPrivileged && (
                  <div className="tm-card-actions">
                    <button className="btn small" onClick={() => handleEdit(t)}>Edit</button>
                    <button className="btn small" onClick={() => handleAdvance(t.id)}>Advance</button>
                    <button className="btn small danger" onClick={() => handleDelete(t.id)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}

        {!loading && tournaments.length === 0 && (
          <div className="tm-empty">No tournaments found.</div>
        )}
      </div>
    </div>
  );
};

export default TournamentManagement;
