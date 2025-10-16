import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getEndpoint } from '../../config/api';
import './Settings.css';

const Tabs = ['Account', 'Preferences', 'Notifications', 'Security', 'Danger Zone'];

const Settings = ({ token }) => {
  const [activeTab, setActiveTab] = useState('Account');
  const [profile, setProfile] = useState(null);
  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('prefs') || '{}'); } catch { return {}; }
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [notifPrefs, setNotifPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('notif_prefs') || '{"email":true,"push":true,"system":true,"match":true}'); } catch { return { email: true, push: true, system: true, match: true }; }
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(getEndpoint('PROFILE'), { headers: { Authorization: `Bearer ${token}` } });
        setProfile(res.data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load profile');
      }
    };
    load();
  }, [token]);

  useEffect(() => {
    try { localStorage.setItem('prefs', JSON.stringify(prefs)); } catch {}
  }, [prefs]);

  useEffect(() => {
    try { localStorage.setItem('notif_prefs', JSON.stringify(notifPrefs)); } catch {}
  }, [notifPrefs]);

  const role = useMemo(() => profile?.role || 'GUEST', [profile]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await axios.put(getEndpoint('PROFILE'), profile, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Profile saved');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = () => {
    setMessage('Preferences saved');
  };

  const saveNotifications = () => {
    setMessage('Notification preferences saved');
  };

  const changePassword = async () => {
    setError('');
    setMessage('');
    if (!passwords.next || passwords.next !== passwords.confirm) {
      setError('Passwords do not match');
      return;
    }
    // Placeholder: integrate with backend password change endpoint if available
    setMessage('Password updated');
    setPasswords({ current: '', next: '', confirm: '' });
  };

  const deactivateAccount = () => {
    if (!window.confirm('Are you sure you want to deactivate your account?')) return;
    setMessage('Deactivation requested');
  };

  if (!profile) return <div className="settings-container">Loading settings...</div>;

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Settings</h2>
        <div className="settings-tabs" role="tablist">
          {Tabs.map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={activeTab === t}
              className={`settings-tab ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}
            >{t}</button>
          ))}
        </div>
      </div>

      {(error || message) && (
        <div className="settings-messages">
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
        </div>
      )}

      {activeTab === 'Account' && (
        <div className="settings-section">
          <div className="grid-2">
            <div className="form-group">
              <label>Username</label>
              <input name="username" value={profile.username || ''} disabled />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" value={profile.email || ''} onChange={handleProfileChange} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input name="role" value={role} disabled />
            </div>
            {role !== 'GUEST' && (
              <>
                <div className="form-group">
                  <label>FIFA ID</label>
                  <input name="fifaId" value={profile.fifaId || ''} onChange={handleProfileChange} />
                </div>
                <div className="form-group">
                  <label>Team</label>
                  <input name="team" value={profile.team || ''} onChange={handleProfileChange} />
                </div>
              </>
            )}
            <div className="form-group">
              <label>Confederation</label>
              <input name="confederation" value={profile.confederation || ''} onChange={handleProfileChange} />
            </div>
          </div>
          <div className="row right">
            <button className="btn" onClick={saveProfile} disabled={saving}>{saving ? 'Saving…' : 'Save Profile'}</button>
          </div>
        </div>
      )}

      {activeTab === 'Preferences' && (
        <div className="settings-section">
          <div className="grid-2">
            <div className="form-group">
              <label>Theme</label>
              <select value={prefs.theme || 'system'} onChange={(e) => setPrefs({ ...prefs, theme: e.target.value })}>
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select value={prefs.lang || 'en'} onChange={(e) => setPrefs({ ...prefs, lang: e.target.value })}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time Zone</label>
              <input value={prefs.tz || Intl.DateTimeFormat().resolvedOptions().timeZone} onChange={(e) => setPrefs({ ...prefs, tz: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Date Format</label>
              <select value={prefs.dateFmt || 'DMY'} onChange={(e) => setPrefs({ ...prefs, dateFmt: e.target.value })}>
                <option value="DMY">DD/MM/YYYY</option>
                <option value="MDY">MM/DD/YYYY</option>
                <option value="YMD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
          <div className="row right">
            <button className="btn" onClick={savePreferences}>Save Preferences</button>
          </div>
        </div>
      )}

      {activeTab === 'Notifications' && (
        <div className="settings-section">
          <div className="grid-2">
            <div className="form-group checkbox">
              <label><input type="checkbox" checked={!!notifPrefs.email} onChange={(e) => setNotifPrefs({ ...notifPrefs, email: e.target.checked })} /> Email Notifications</label>
            </div>
            <div className="form-group checkbox">
              <label><input type="checkbox" checked={!!notifPrefs.push} onChange={(e) => setNotifPrefs({ ...notifPrefs, push: e.target.checked })} /> Push Notifications</label>
            </div>
            <div className="form-group checkbox">
              <label><input type="checkbox" checked={!!notifPrefs.system} onChange={(e) => setNotifPrefs({ ...notifPrefs, system: e.target.checked })} /> System Alerts</label>
            </div>
            <div className="form-group checkbox">
              <label><input type="checkbox" checked={!!notifPrefs.match} onChange={(e) => setNotifPrefs({ ...notifPrefs, match: e.target.checked })} /> Match Updates</label>
            </div>
          </div>
          <div className="row right">
            <button className="btn" onClick={saveNotifications}>Save Notification Preferences</button>
          </div>
        </div>
      )}

      {activeTab === 'Security' && (
        <div className="settings-section">
          <div className="grid-2">
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
            </div>
          </div>
          <div className="row right">
            <button className="btn" onClick={changePassword}>Change Password</button>
          </div>
        </div>
      )}

      {activeTab === 'Danger Zone' && (
        <div className="settings-section danger">
          <p>These actions are irreversible. Proceed with caution.</p>
          <div className="row right">
            <button className="btn danger" onClick={deactivateAccount}>Deactivate Account</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;


