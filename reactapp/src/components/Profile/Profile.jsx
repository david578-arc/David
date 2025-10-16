import React, { useEffect, useState } from 'react';
import './Profile.css';
import { getEndpoint } from '../../config/api';

const Profile = ({ token, onSaved }) => {
  const [form, setForm] = useState({ email: '', team: '', confederation: '' });
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(getEndpoint('PROFILE'), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMe(data);
        setForm({
          email: data.email || '',
          team: data.team || '',
          confederation: data.confederation || ''
        });
      } catch (e) {
        setMessage('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // Preview only
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(getEndpoint('PROFILE'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed');
      setMessage('Profile updated successfully!');
      onSaved && onSaved();
    } catch (e) {
      setMessage('Failed to update profile');
    }
  };

  const handleReset = () => {
    if (me) {
      setForm({
        email: me.email || '',
        team: me.team || '',
        confederation: me.confederation || ''
      });
    }
  };

  if (loading) return <div className="loader-container">Loading profile...</div>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      {message && <div className="message-box">{message}</div>}

      {me && (
        <div className="profile-summary">
          <div className="profile-image-section">
            <img
              src={profileImage || '/default-avatar.png'}
              alt="Profile"
              className="profile-avatar"
            />
            <label className="upload-label">
              Change Photo
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          <div className="profile-info">
            <div><strong>Username:</strong> {me.username}</div>
            <div><strong>Role:</strong> {String(me.role).replace('_', ' ')}</div>
            {me.role !== 'GUEST' && (
              <>
                <div><strong>FIFA ID:</strong> {me.fifaId || '—'}</div>
                <div><strong>Team:</strong> {me.team || '—'}</div>
              </>
            )}
            <div><strong>Confederation:</strong> {me.confederation || '—'}</div>
            <div><strong>Status:</strong> {me.isActive ? 'Active' : 'Inactive'}</div>
            <div><strong>Created:</strong> {new Date(me.createdDate).toLocaleString()}</div>
            <div><strong>Last Login:</strong> {new Date(me.lastLogin).toLocaleString()}</div>
          </div>
        </div>
      )}

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>Email:
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>
        {me?.role !== 'GUEST' && (
          <label>Team:
            <input type="text" name="team" value={form.team} onChange={handleChange} />
          </label>
        )}
        <label>Confederation:
          <input type="text" name="confederation" value={form.confederation} onChange={handleChange} />
        </label>
        <div className="form-buttons">
          <button type="submit">Save</button>
          <button type="button" className="reset-btn" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
