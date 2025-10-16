import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeamManagement.css';

const TeamManagement = ({ token }) => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  // form state
  const [formData, setFormData] = useState({
    teamName: '',
    confederation: '',
    fifaRanking: '',
    headCoach: '',
    teamManager: ''
  });

  // filter/sort/pagination states
  const [confederationFilter, setConfederationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage, setTeamsPerPage] = useState(6);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [teams, confederationFilter, statusFilter, sortOption, currentPage]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        'https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/teams',
        config
      );
      setTeams(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch teams: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const teamData = {
        ...formData,
        fifaRanking: formData.fifaRanking ? parseInt(formData.fifaRanking) : null
      };

      if (editingTeam) {
        await axios.put(
          `https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/teams/${editingTeam.id}`,
          teamData,
          config
        );
      } else {
        await axios.post(
          'https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/teams/register',
          teamData,
          config
        );
      }

      await fetchTeams();
      resetForm();
      setError('');
    } catch (err) {
      setError('Failed to save team: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      teamName: team.teamName,
      confederation: team.confederation,
      fifaRanking: team.fifaRanking?.toString() || '',
      headCoach: team.headCoach || '',
      teamManager: team.teamManager || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(
          `https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/teams/${id}`,
          config
        );
        await fetchTeams();
        setError('');
      } catch (err) {
        setError('Failed to delete team: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusUpdate = async (teamId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(
        `https://8080-acbffafcdacceebbbdbcfdbdb.premiumproject.examly.io/api/teams/${teamId}/status`,
        { status: newStatus },
        config
      );
      await fetchTeams();
    } catch (err) {
      setError('Failed to update team status: ' + (err.response?.data?.message || err.message));
    }
  };

  const resetForm = () => {
    setFormData({
      teamName: '',
      confederation: '',
      fifaRanking: '',
      headCoach: '',
      teamManager: ''
    });
    setEditingTeam(null);
    setShowAddForm(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#ffc107',
      APPROVED: '#28a745',
      REJECTED: '#dc3545',
      QUALIFIED: '#17a2b8',
      ELIMINATED: '#6c757d',
      CHAMPION: '#ffd700'
    };
    return colors[status] || '#6c757d';
  };

  // 🔍 Filtering, sorting & pagination logic
  const applyFiltersAndSorting = () => {
    let filtered = [...teams];

    if (confederationFilter)
      filtered = filtered.filter((t) => t.confederation === confederationFilter);

    if (statusFilter) filtered = filtered.filter((t) => t.status === statusFilter);

    if (sortOption === 'name-asc')
      filtered.sort((a, b) => a.teamName.localeCompare(b.teamName));
    else if (sortOption === 'name-desc')
      filtered.sort((a, b) => b.teamName.localeCompare(a.teamName));
    else if (sortOption === 'rank-asc')
      filtered.sort((a, b) => (a.fifaRanking || 9999) - (b.fifaRanking || 9999));
    else if (sortOption === 'rank-desc')
      filtered.sort((a, b) => (b.fifaRanking || 0) - (a.fifaRanking || 0));

    // pagination
    const indexOfLast = currentPage * teamsPerPage;
    const indexOfFirst = indexOfLast - teamsPerPage;
    const currentTeams = filtered.slice(indexOfFirst, indexOfLast);

    setFilteredTeams(currentTeams);
  };

  const totalPages = Math.ceil(
    teams.filter((t) => {
      if (confederationFilter && t.confederation !== confederationFilter) return false;
      if (statusFilter && t.status !== statusFilter) return false;
      return true;
    }).length / teamsPerPage
  );

  return (
    <div className="team-management">
      <div className="page-header">
        <h2>Team Management</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="add-button">
          {showAddForm ? 'Cancel' : '+ Add New Team'}
        </button>
      </div>

      {/* 🔍 Filters & Sorting */}
      <div className="filter-bar">
        <select
          value={confederationFilter}
          onChange={(e) => {
            setConfederationFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Confederations</option>
          <option value="UEFA">UEFA</option>
          <option value="CONMEBOL">CONMEBOL</option>
          <option value="CONCACAF">CONCACAF</option>
          <option value="CAF">CAF</option>
          <option value="AFC">AFC</option>
          <option value="OFC">OFC</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="ELIMINATED">Eliminated</option>
          <option value="CHAMPION">Champion</option>
        </select>

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort By</option>
          <option value="name-asc">Team Name (A-Z)</option>
          <option value="name-desc">Team Name (Z-A)</option>
          <option value="rank-asc">FIFA Ranking (Low → High)</option>
          <option value="rank-desc">FIFA Ranking (High → Low)</option>
        </select>

        <select value={teamsPerPage} onChange={(e) => setTeamsPerPage(Number(e.target.value))}>
          <option value={6}>6 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && (
        <div className="form-container">
          <h3>{editingTeam ? 'Edit Team' : 'Add New Team'}</h3>
          <form onSubmit={handleSubmit} className="team-form">
            <div className="form-row">
              <div className="form-group">
                <label>Team Name</label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confederation</label>
                <select
                  name="confederation"
                  value={formData.confederation}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Confederation</option>
                  <option value="UEFA">UEFA</option>
                  <option value="CONMEBOL">CONMEBOL</option>
                  <option value="CONCACAF">CONCACAF</option>
                  <option value="CAF">CAF</option>
                  <option value="AFC">AFC</option>
                  <option value="OFC">OFC</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>FIFA Ranking</label>
                <input
                  type="number"
                  name="fifaRanking"
                  value={formData.fifaRanking}
                  onChange={handleInputChange}
                  min="1"
                  max="211"
                />
              </div>
              <div className="form-group">
                <label>Head Coach</label>
                <input
                  type="text"
                  name="headCoach"
                  value={formData.headCoach}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Team Manager</label>
              <input
                type="text"
                name="teamManager"
                value={formData.teamManager}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : editingTeam ? 'Update Team' : 'Add Team'}
              </button>
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 🧾 Teams Grid */}
      <div className="teams-grid">
        {filteredTeams.map((team) => (
          <div key={team.id} className="team-card">
            <div className="team-header">
              <h3>{team.teamName}</h3>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(team.status) }}
              >
                {team.status}
              </span>
            </div>

            <div className="team-details">
              <div className="detail-item">
                <span className="label">Confederation:</span>
                <span className="value">{team.confederation}</span>
              </div>
              <div className="detail-item">
                <span className="label">FIFA Ranking:</span>
                <span className="value">{team.fifaRanking || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Head Coach:</span>
                <span className="value">{team.headCoach || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Team Manager:</span>
                <span className="value">{team.teamManager || 'N/A'}</span>
              </div>
            </div>

            <div className="team-actions">
              <select
                value={team.status}
                onChange={(e) => handleStatusUpdate(team.id, e.target.value)}
                className="status-select"
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="ELIMINATED">Eliminated</option>
                <option value="CHAMPION">Champion</option>
              </select>

              <button onClick={() => handleEdit(team)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(team.id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🧭 Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} / {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default TeamManagement;
