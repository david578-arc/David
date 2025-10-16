import React, { useEffect, useMemo, useState } from 'react';
import './PressConferences.css';

const ROLES_CAN_POST = new Set(['MEDIA_REPRESENTATIVE']);

const PressConferences = ({ user }) => {
  const canPost = useMemo(() => !!user && ROLES_CAN_POST.has(user.role), [user]);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => {
    try { setPosts(JSON.parse(localStorage.getItem('press_posts') || '[]')); } catch { setPosts([]); }
  }, []);

  const publish = () => {
    if (!canPost || !form.title || !form.content) return;
    const post = { id: Date.now(), ...form, author: user.username, createdAt: new Date().toISOString() };
    const next = [post, ...posts];
    setPosts(next);
    try { localStorage.setItem('press_posts', JSON.stringify(next)); } catch {}
    setForm({ title: '', content: '' });
  };

  return (
    <div className="press-container">
      <div className="press-header">
        <h2>Press Conferences</h2>
      </div>
      {canPost && (
        <div className="press-form">
          <div className="form-group">
            <label>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="row right">
            <button className="btn" onClick={publish}>Publish</button>
          </div>
        </div>
      )}

      <div className="press-list">
        {posts.map(p => (
          <article key={p.id} className="press-item">
            <header className="press-meta">
              <h3>{p.title}</h3>
              <div>By {p.author} on {new Date(p.createdAt).toLocaleString()}</div>
            </header>
            <p>{p.content}</p>
          </article>
        ))}
        {posts.length === 0 && <div>No press posts yet.</div>}
      </div>
    </div>
  );
};

export default PressConferences;


