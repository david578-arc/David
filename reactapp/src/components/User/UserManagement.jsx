import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserManagement.css';
import { getEndpoint } from '../../config/api';

const UserManagement = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', role: 'GUEST' });

  // 🔍 Filter/sort/search/pagination states
  const [roleFilter, setRoleFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(6);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [users, roleFilter, sortOption, searchTerm, currentPage, usersPerPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(getEndpoint('ADMIN_USERS') || '/api/auth/users', config);
      setUsers(res.data);
      setError('');
    } catch (e) {
      setError('Failed to load users: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingUser) {
        const url = `${getEndpoint('ADMIN_USERS')}/${editingUser.id}`;
        await axios.put(url, formData, config);
      }
      setEditingUser(null);
      setFormData({ username: '', email: '', role: 'GUEST' });
      fetchUsers();
    } catch (e) {
      setError('Failed to save user: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/auth/users/${id}`, config);
      fetchUsers();
    } catch (e) {
      setError('Failed to delete user: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Filter/sort/search logic
  const applyFiltersAndSorting = () => {
    let filtered = [...users];

    if (roleFilter) filtered = filtered.filter((u) => u.role === roleFilter);

    if (searchTerm)
      filtered = filtered.filter(
        (u) =>
          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortOption === 'username-asc')
      filtered.sort((a, b) => a.username.localeCompare(b.username));
    else if (sortOption === 'username-desc')
      filtered.sort((a, b) => b.username.localeCompare(a.username));
    else if (sortOption === 'email-asc')
      filtered.sort((a, b) => a.email.localeCompare(b.email));
    else if (sortOption === 'email-desc')
      filtered.sort((a, b) => b.email.localeCompare(a.email));

    const indexOfLast = currentPage * usersPerPage;
    const indexOfFirst = indexOfLast - usersPerPage;
    const current = filtered.slice(indexOfFirst, indexOfLast);

    setFilteredUsers(current);
  };

  const totalPages = Math.ceil(
    users.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false;
      if (searchTerm) {
        const match =
          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase());
        if (!match) return false;
      }
      return true;
    }).length / usersPerPage
  );

  return (
    <div className="user-management">
      <div className="um-header">
        <h2>👥 User Management</h2>
      </div>

      {error && <div className="um-error">{error}</div>}

      {/* 🔍 Filters, Search, Sort */}
      <div className="um-filter-bar">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Roles</option>
          <option value="FIFA_ADMIN">FIFA_ADMIN</option>
          <option value="TEAM_MANAGER">TEAM_MANAGER</option>
          <option value="COACH">COACH</option>
          <option value="PLAYER">PLAYER</option>
          <option value="TOURNAMENT_DIRECTOR">TOURNAMENT_DIRECTOR</option>
          <option value="MATCH_OFFICIAL">MATCH_OFFICIAL</option>
          <option value="MEDIA_REPRESENTATIVE">MEDIA_REPRESENTATIVE</option>
          <option value="GUEST">GUEST</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="username-asc">Username (A-Z)</option>
          <option value="username-desc">Username (Z-A)</option>
          <option value="email-asc">Email (A-Z)</option>
          <option value="email-desc">Email (Z-A)</option>
        </select>

        <select
          value={usersPerPage}
          onChange={(e) => setUsersPerPage(Number(e.target.value))}
        >
          <option value={6}>6 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>

      {/* 📝 Edit Modal */}
      {editingUser && (
        <div className="um-form-modal">
          <div className="um-form">
            <div className="um-form-header">
              <h3>Edit User</h3>
              <button className="um-close" onClick={() => setEditingUser(null)}>✕</button>
            </div>
            <form onSubmit={save}>
              <div className="um-grid">
                <div className="um-field">
                  <label>Username</label>
                  <input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="um-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="um-field">
                  <label>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="FIFA_ADMIN">FIFA_ADMIN</option>
                    <option value="TEAM_MANAGER">TEAM_MANAGER</option>
                    <option value="COACH">COACH</option>
                    <option value="PLAYER">PLAYER</option>
                    <option value="TOURNAMENT_DIRECTOR">TOURNAMENT_DIRECTOR</option>
                    <option value="MATCH_OFFICIAL">MATCH_OFFICIAL</option>
                    <option value="MEDIA_REPRESENTATIVE">MEDIA_REPRESENTATIVE</option>
                    <option value="GUEST">GUEST</option>
                  </select>
                </div>
              </div>
              <div className="um-actions">
                <button type="button" className="ghost" onClick={() => setEditingUser(null)}>
                  Cancel
                </button>
                <button type="submit" className="primary" disabled={loading}>
                  {loading ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📋 Table */}
      <div className="um-table">
        <div className="um-table-header">
          <div>Username</div>
          <div>Email</div>
          <div>Role</div>
          <div>Actions</div>
        </div>

        {filteredUsers.map((u) => (
          <div key={u.id} className="um-row">
            <div>{u.username}</div>
            <div>{u.email}</div>
            <div>{u.role}</div>
            <div className="um-row-actions">
              <button
                className="small"
                onClick={() => {
                  setEditingUser(u);
                  setFormData({
                    username: u.username || '',
                    email: u.email || '',
                    role: u.role || 'GUEST'
                  });
                }}
              >
                Edit
              </button>
              <button className="small danger" onClick={() => remove(u.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && !loading && (
          <div className="um-empty">No users found.</div>
        )}
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

      {loading && <div className="um-loading">Loading...</div>}
    </div>
  );
};

export default UserManagement;
