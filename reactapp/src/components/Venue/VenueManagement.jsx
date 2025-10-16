import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VenueManagement.css';
import { getEndpoint } from '../../config/api';

const VenueManagement = ({ token }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [minCap, setMinCap] = useState('');
  const [maxCap, setMaxCap] = useState('');
  const [selected, setSelected] = useState(null);

  const [formData, setFormData] = useState({
    venueName: '',
    city: '',
    country: '',
    capacity: '',
    surfaceType: ''
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(getEndpoint('VENUES'), config);
      setVenues(res.data);
      setError('');
    } catch (e) {
      setError('Failed to load venues: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  const filtered = venues
    .filter(v => (query.trim()==='' || (v.venueName||'').toLowerCase().includes(query.toLowerCase())))
    .filter(v => (city.trim()==='' || (v.city||'').toLowerCase().includes(city.toLowerCase())))
    .filter(v => (country.trim()==='' || (v.country||'').toLowerCase().includes(country.toLowerCase())))
    .filter(v => (minCap==='' || (v.capacity||0) >= parseInt(minCap,10)))
    .filter(v => (maxCap==='' || (v.capacity||0) <= parseInt(maxCap,10)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { ...formData, capacity: formData.capacity ? parseInt(formData.capacity, 10) : null };
      if (editingVenue) {
        await axios.put(`${getEndpoint('VENUES')}/${editingVenue.id}`, payload, config);
      } else {
        await axios.post(getEndpoint('VENUES'), payload, config);
      }
      resetForm();
      fetchVenues();
    } catch (e) {
      setError('Failed to save venue: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this venue?')) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${getEndpoint('VENUES')}/${id}`, config);
      fetchVenues();
    } catch (e) {
      setError('Failed to delete venue: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setFormData({
      venueName: venue.venueName || '',
      city: venue.city || '',
      country: venue.country || '',
      capacity: venue.capacity?.toString() || '',
      surfaceType: venue.surfaceType || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingVenue(null);
    setFormData({ venueName: '', city: '', country: '', capacity: '', surfaceType: '' });
    setShowForm(false);
  };

  return (
    <div className="venue-management">
      <div className="vm-header">
        <h2>📍 Venue Management</h2>
        <button className="vm-add-btn" onClick={() => { setShowForm(true); setEditingVenue(null); }}>+ Add Venue</button>
      </div>

      {error && <div className="vm-error">{error}</div>}

      <div className="vm-toolbar">
        <div className="vm-searchbar">
          <span>🔎</span>
          <input className="vm-input" placeholder="Search name" value={query} onChange={(e)=>setQuery(e.target.value)} />
        </div>
        <div className="row gap-8">
          <input className="vm-input" placeholder="City" value={city} onChange={(e)=>setCity(e.target.value)} />
          <input className="vm-input" placeholder="Country" value={country} onChange={(e)=>setCountry(e.target.value)} />
          <input className="vm-input" type="number" placeholder="Min cap" value={minCap} onChange={(e)=>setMinCap(e.target.value)} />
          <input className="vm-input" type="number" placeholder="Max cap" value={maxCap} onChange={(e)=>setMaxCap(e.target.value)} />
        </div>
      </div>

      {showForm && (
        <div className="vm-form-modal">
          <div className="vm-form">
            <div className="vm-form-header">
              <h3>{editingVenue ? 'Edit Venue' : 'Add Venue'}</h3>
              <button className="vm-close" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="vm-grid">
                <div className="vm-field">
                  <label>Name</label>
                  <input value={formData.venueName} onChange={(e) => setFormData({ ...formData, venueName: e.target.value })} required />
                </div>
                <div className="vm-field">
                  <label>City</label>
                  <input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
                </div>
                <div className="vm-field">
                  <label>Country</label>
                  <input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} required />
                </div>
                <div className="vm-field">
                  <label>Capacity</label>
                  <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} />
                </div>
                <div className="vm-field">
                  <label>Surface</label>
                  <select value={formData.surfaceType} onChange={(e) => setFormData({ ...formData, surfaceType: e.target.value })}>
                    <option value="">Select</option>
                    <option value="GRASS">Grass</option>
                    <option value="TURF">Turf</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="vm-actions">
                <button type="button" className="ghost" onClick={resetForm}>Cancel</button>
                <button type="submit" className="primary" disabled={loading}>{loading ? 'Saving…' : (editingVenue ? 'Update Venue' : 'Create Venue')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="vm-grid-list">
        {loading && <div className="vm-loading">Loading venues…</div>}
        {!loading && filtered.map(v => (
          <div key={v.id} className="vm-card">
            <div className="vm-card-header">
              <h4>{v.venueName}</h4>
              <div className="vm-card-actions">
                <button onClick={() => handleEdit(v)} className="small">Edit</button>
                <button onClick={() => handleDelete(v.id)} className="small danger">Delete</button>
              </div>
            </div>
            <div className="vm-card-body">
              <div className="vm-row"><span>📍 Location:</span> {v.city}, {v.country}</div>
              <div className="vm-row"><span>🧑‍🤝‍🧑 Capacity:</span> {v.capacity || 'N/A'}</div>
              <div className="vm-row"><span>🟩 Surface:</span> {v.surfaceType || 'N/A'}</div>
              <div className="vm-row"><button className="btn" onClick={()=>setSelected(v)}>View Details</button></div>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="vm-empty">No venues yet. Add your first venue.</div>
        )}
      </div>

      {selected && (
        <div className="vm-form-modal" onClick={()=>setSelected(null)}>
          <div className="vm-form" onClick={(e)=>e.stopPropagation()}>
            <div className="form-header">
              <h3>{selected.venueName}</h3>
              <button className="vm-close" onClick={()=>setSelected(null)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group"><label>City</label><div>{selected.city}</div></div>
              <div className="form-group"><label>Country</label><div>{selected.country}</div></div>
              <div className="form-group"><label>Capacity</label><div>{selected.capacity || 'N/A'}</div></div>
              <div className="form-group"><label>Surface</label><div>{selected.surfaceType || 'N/A'}</div></div>
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={()=>setSelected(null)}>Close</button>
              <button className="save-btn" onClick={()=>{ setEditingVenue(selected); setFormData({ venueName: selected.venueName||'', city: selected.city||'', country: selected.country||'', capacity: (selected.capacity||'').toString(), surfaceType: selected.surfaceType||'' }); setShowForm(true); setSelected(null); }}>Edit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueManagement;


