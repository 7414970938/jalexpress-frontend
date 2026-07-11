import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';

const SERVICES = ['Drinking Water', 'Borewell Water', 'Construction Water'];

export default function OwnerOnboarding() {
  const { token, user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [ownerName, setOwnerName] = useState(user?.ownerName || '');
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [services, setServices] = useState([]);
  const [areas, setAreas] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleService = (s) => {
    setServices((prev) => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSave = async () => {
    setError('');
    if (!ownerName || !businessName || services.length === 0) {
      setError('Please fill your name, business name, and pick at least one service');
      return;
    }
    setLoading(true);
    try {
      const res = await api.updateOwnerProfile(token, {
        ownerName,
        businessName,
        servicesOffered: services,
        serviceArea: { areas: areas.split(',').map(a => a.trim()).filter(Boolean), city: 'Pune' }
      });
      updateUser(res.owner);
      navigate('/owner/price-list');
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="screen">
      <div className="brand-logo" style={{ margin: '20px 0' }}>
        <div className="avatar" style={{ width: 70, height: 70, margin: '0 auto' }}>👤</div>
      </div>

      <label className="field-label">Your Name</label>
      <input className="input-field" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="e.g. Rajesh Sharma" />

      <label className="field-label">Business / Tanker Service Name</label>
      <input className="input-field" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Sharma Tankers" />

      <label className="field-label">Mobile No.</label>
      <input className="input-field" value={user?.phone} readOnly />

      <label className="field-label">Services You Offer</label>
      <div className="pill-group">
        {SERVICES.map((s) => (
          <button key={s} className={`pill ${services.includes(s) ? 'active' : ''}`} onClick={() => toggleService(s)}>{s}</button>
        ))}
      </div>

      <label className="field-label">Service Areas (comma separated)</label>
      <input className="input-field" value={areas} onChange={(e) => setAreas(e.target.value)} placeholder="Wakad, Hinjewadi, Baner" />

      {error && <p className="error-text">{error}</p>}

      <button className="btn-primary" onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save & Continue'}
      </button>
    </div>
  );
}
