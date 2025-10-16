import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { getEndpoint } from '../../config/api';

const ROLES_CAN_MANAGE = new Set(['FIFA_ADMIN','TOURNAMENT_DIRECTOR','COACH','TEAM_MANAGER','MATCH_OFFICIAL']);

const NotificationsCenter = ({ token, user }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [compose, setCompose] = useState({ message: '', type: 'SYSTEM', userId: '' });
  const [filter, setFilter] = useState({ scope: 'MY', type: 'ALL' });

  const canManage = useMemo(() => !!user && ROLES_CAN_MANAGE.has(user.role), [user]);

  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { load(); }, [filter.scope, filter.type]);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true); setError('');
    try {
      let url;
      if (filter.scope === 'MY') url = getEndpoint('NOTIFICATIONS_BY_USER', { userId: user.id });
      else url = getEndpoint('NOTIFICATIONS_UNREAD_BY_USER', { userId: user.id });
      const res = await axios.get(url, headers);
      let data = res.data || [];
      if (filter.type !== 'ALL') data = data.filter(n => n.type === filter.type);
      setItems(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    try {
      if (!compose.message) return;
      if (compose.userId) {
        await axios.post(getEndpoint('NOTIFICATIONS'), { message: compose.message, type: compose.type, userId: compose.userId }, headers);
      } else {
        await axios.post(getEndpoint('NOTIFICATION_BROADCAST'), { message: compose.message, type: compose.type }, headers);
      }
      setCompose({ message: '', type: 'SYSTEM', userId: '' });
      load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to send notification');
    }
  };

  const markRead = async (id) => {
    try {
      await axios.put(getEndpoint('NOTIFICATION_MARK_READ', { id }), {}, headers);
      setItems(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  const remove = async (id) => {
    try {
      await axios.delete(getEndpoint('NOTIFICATION_DELETE', { id }), headers);
      setItems(prev => prev.filter(n => n.id !== id));
    } catch {}
  };

  const reply = async (note) => {
    try {
      const content = window.prompt('Reply to notification:', `Re: ${note.message}`);
      if (!content) return;
      await axios.post(getEndpoint('NOTIFICATIONS'), { message: content, type: 'SYSTEM', userId: note.senderId || note.userId }, headers);
      alert('Reply sent');
    } catch (e) { alert('Failed to send reply'); }
  };

  return (
    <div className="notifications-center" style={{ padding: '16px' }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Notifications</h2>
        <div>
          <select value={filter.scope} onChange={(e) => setFilter({ ...filter, scope: e.target.value })}>
            <option value="MY">My Notifications</option>
            <option value="UNREAD">Unread Only</option>
          </select>
          <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })} style={{ marginLeft: 8 }}>
            <option value="ALL">All Types</option>
            <option value="SYSTEM">SYSTEM</option>
            <option value="MATCH">MATCH</option>
            <option value="INFO">INFO</option>
          </select>
          <button className="btn" onClick={load} style={{ marginLeft: 8 }}>Refresh</button>
        </div>
      </div>

      {canManage && (
        <div className="compose" style={{ marginTop: 12, background: '#0b132b', border: '1px solid #243b55', borderRadius: 8, padding: 12 }}>
          <div className="row" style={{ gap: 8 }}>
            <select value={compose.type} onChange={(e) => setCompose({ ...compose, type: e.target.value })}>
              <option value="SYSTEM">SYSTEM</option>
              <option value="MATCH">MATCH</option>
              <option value="INFO">INFO</option>
            </select>
            <input placeholder="Target user ID (optional)" value={compose.userId} onChange={(e) => setCompose({ ...compose, userId: e.target.value })} />
          </div>
          <div className="row" style={{ marginTop: 8 }}>
            <input style={{ flex: 1 }} placeholder="Write a message..." value={compose.message} onChange={(e) => setCompose({ ...compose, message: e.target.value })} />
            <button className="btn" onClick={send}>Send</button>
          </div>
        </div>
      )}

      <div className="list" style={{ marginTop: 12 }}>
        {loading && <div>Loading…</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && items.length === 0 && <div>No notifications</div>}
        {!loading && items.map(n => (
          <div key={n.id} className="note-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b132b', border: '1px solid #243b55', borderRadius: 8, padding: 10, marginBottom: 8 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{n.type}</div>
              <div>{n.message}</div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn" onClick={() => markRead(n.id)}>Mark Read</button>
              {!canManage && <button className="btn" onClick={() => reply(n)}>Reply</button>}
              {canManage && <button className="btn danger" onClick={() => remove(n.id)}>Delete</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsCenter;


