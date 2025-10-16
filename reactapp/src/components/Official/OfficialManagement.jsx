import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OfficialManagement.css';
import { getEndpoint } from '../../config/api';

const OfficialManagement = ({ token }) => {
  const [officials, setOfficials] = useState([]);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [minExp, setMinExp] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    nationality: '',
    experienceYears: '',
    officialType: 'REFEREE'
  });

  useEffect(() => { fetchOfficials(); }, []);

  const fetchOfficials = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(getEndpoint('OFFICIALS'), config);
      setOfficials(res.data);
      setError('');
    } catch (e) {
      setError('Failed to load officials: ' + (e.response?.data?.message || e.message));
    } finally { setLoading(false); }
  };

  const filtered = officials
    .filter(o => (typeFilter === 'ALL' || o.officialType === typeFilter))
    .filter(o => (minExp === '' || (o.experienceYears || 0) >= parseInt(minExp,10)))
    .filter(o => (query.trim() === '' || (o.name||'').toLowerCase().includes(query.toLowerCase()) || (o.nationality||'').toLowerCase().includes(query.toLowerCase())));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload =  {officialName: formData.name,
      nationality: formData.nationality,
      experience: formData.experienceYears ? parseInt(formData.experienceYears, 10) : 0,
      officialType: formData.officialType}
      if (editingOfficial) {
        await axios.put(`${getEndpoint('OFFICIALS')}/${editingOfficial.id}`, payload, config);
      } else {
        await axios.post(getEndpoint('OFFICIALS'), payload, config);
      }
      resetForm();
      fetchOfficials();
    } catch (e) {
      setError('Failed to save official: ' + (e.response?.data?.message || e.message));
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this official?')) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${getEndpoint('OFFICIALS')}/${id}`, config);
      fetchOfficials();
    } catch (e) {
      setError('Failed to delete official: ' + (e.response?.data?.message || e.message));
    } finally { setLoading(false); }
  };

  const handleEdit = (o) => {
    setEditingOfficial(o);
    setFormData({
      name: o.name || '',
      nationality: o.nationality || '',
      experienceYears: o.experienceYears?.toString() || '',
      officialType: o.officialType || 'REFEREE'
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingOfficial(null);
    setFormData({ name: '', nationality: '', experienceYears: '', officialType: 'REFEREE' });
    setShowForm(false);
  };

  return (
    <div className="official-management">
      <div className="om-header">
        <h2>👨‍⚖️ Official Management</h2>
        <button className="om-add-btn" onClick={() => { setShowForm(true); setEditingOfficial(null); }}>+ Add Official</button>
      </div>

      {error && <div className="om-error">{error}</div>}

      <div className="om-toolbar">
        <div className="om-searchbar">
          <span>🔎</span>
          <input placeholder="Search by name or nationality" value={query} onChange={(e)=>setQuery(e.target.value)} />
        </div>
        <div className="row gap-8">
          <select className="om-select" value={typeFilter} onChange={(e)=>setTypeFilter(e.target.value)}>
            <option value="ALL">All Types</option>
            <option value="REFEREE">Referee</option>
            <option value="ASSISTANT_REFEREE">Assistant Referee</option>
            <option value="FOURTH_OFFICIAL">Fourth Official</option>
          </select>
          <input className="om-input" type="number" min="0" placeholder="Min experience" value={minExp} onChange={(e)=>setMinExp(e.target.value)} />
          <button className={`btn ${viewMode==='cards'?'primary':''}`} onClick={()=>setViewMode('cards')}>Cards</button>
          <button className={`btn ${viewMode==='table'?'primary':''}`} onClick={()=>setViewMode('table')}>Table</button>
        </div>
      </div>

      {showForm && (
        <div className="om-form-modal">
          <div className="om-form">
            <div className="om-form-header">
              <h3>{editingOfficial ? 'Edit Official' : 'Add Official'}</h3>
              <button className="om-close" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="om-grid">
                <div className="om-field"><label>Name</label><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
                <div className="om-field"><label>Nationality</label><input value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} required /></div>
                <div className="om-field"><label>Experience (years)</label><input type="number" value={formData.experienceYears} onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })} min="0" /></div>
                <div className="om-field">
                  <label>Type</label>
                  <select value={formData.officialType} onChange={(e) => setFormData({ ...formData, officialType: e.target.value })}>
                    <option value="REFEREE">Referee</option>
                    <option value="ASSISTANT_REFEREE">Assistant Referee</option>
                    <option value="FOURTH_OFFICIAL">Fourth Official</option>
                  </select>
                </div>
              </div>
              <div className="om-actions">
                <button type="button" className="ghost" onClick={resetForm}>Cancel</button>
                <button type="submit" className="primary" disabled={loading}>{loading ? 'Saving…' : (editingOfficial ? 'Update Official' : 'Create Official')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewMode==='cards' ? (
      <div className="om-grid-list">
        {loading && <div className="om-loading">Loading officials…</div>}
        {!loading && filtered.map(o => (
          <div key={o.id} className="om-card">
            <div className="om-card-header">
              <h4>{o.name}</h4>
              <div className="om-card-actions">
                <button onClick={() => handleEdit(o)} className="small">Edit</button>
                <button onClick={() => handleDelete(o.id)} className="small danger">Delete</button>
              </div>
            </div>
            <div className="om-card-body">
              <div className="om-row"><span>Type:</span> <span className="om-badge">{o.officialType}</span></div>
              <div className="om-row"><span>Nationality:</span> {o.nationality}</div>
              <div className="om-row"><span>Experience:</span> {o.experienceYears || 0} years</div>
              <div className="om-row"><button className="btn" onClick={()=>setSelected(o)}>View Details</button></div>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="om-empty">No officials yet. Add your first one.</div>
        )}
      </div>
      ) : (
        <div className="om-table">
          <div className="om-table-header">
            <div>Name</div><div>Nationality</div><div>Type</div><div>Experience</div>
          </div>
          {filtered.map(o => (
            <div key={o.id} className="om-table-row">
              <div>{o.name}</div>
              <div>{o.nationality}</div>
              <div><span className="om-badge">{o.officialType}</span></div>
              <div className="om-actions-row">
                <span>{o.experienceYears || 0} years</span>
                <button className="small" onClick={()=>handleEdit(o)}>Edit</button>
                <button className="small danger" onClick={()=>handleDelete(o.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="om-details-modal" onClick={()=>setSelected(null)}>
          <div className="om-details" onClick={(e)=>e.stopPropagation()}>
            <div className="om-details-header">
              <h3>{selected.name}</h3>
              <button className="om-close" onClick={()=>setSelected(null)}>✕</button>
            </div>
            <div className="om-details-body">
              <div className="om-details-item"><div className="muted">Type</div><div className="font-semibold">{selected.officialType}</div></div>
              <div className="om-details-item"><div className="muted">Nationality</div><div className="font-semibold">{selected.nationality}</div></div>
              <div className="om-details-item"><div className="muted">Experience</div><div className="font-semibold">{selected.experienceYears || 0} years</div></div>
              <div className="om-details-item"><div className="muted">ID</div><div className="font-semibold">{selected.id}</div></div>
            </div>
            <div className="om-details-actions">
              <button className="btn ghost" onClick={()=>setSelected(null)}>Close</button>
              <button className="btn" onClick={()=>{ setEditingOfficial(selected); setFormData({ name: selected.name||'', nationality: selected.nationality||'', experienceYears: (selected.experienceYears||'').toString(), officialType: selected.officialType||'REFEREE' }); setShowForm(true); setSelected(null); }}>Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficialManagement;


