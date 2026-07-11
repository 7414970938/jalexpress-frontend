import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import BottomNav from '../../components/BottomNav';

const SERVICE_TYPES = ['Drinking Water', 'Borewell Water', 'Construction Water'];

export default function CustomerHome() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [activeService, setActiveService] = useState('');
  const [loading, setLoading] = useState(true);

  const loadSuppliers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (activeService) params.set('serviceType', activeService);
    try {
      const res = await api.getSuppliers(token, `?${params.toString()}`);
      setSuppliers(res.suppliers);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { loadSuppliers(); }, [activeService]); // eslint-disable-line

  const defaultAddress = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];

  return (
    <>
      <div className="screen">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ color: 'var(--primary)' }}>💧 JalExpress</h2>
            <p style={{ fontWeight: 700, marginTop: 4 }}>Hello, {user?.name || 'there'}</p>
            <p className="muted">
              Deliver to: {defaultAddress ? `${defaultAddress.flatNo}, ${defaultAddress.society}` : 'Add an address in Profile'}
            </p>
          </div>
          <span style={{ fontSize: 22 }}>🔔</span>
        </div>

        <div className="search-bar">
          <span>🔍</span>
          <input
            placeholder="Search water suppliers or tanker size..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadSuppliers()}
          />
          <span onClick={loadSuppliers} style={{ cursor: 'pointer' }}>⚙️</span>
        </div>

        <div className="pill-group">
          <button className={`pill ${activeService === '' ? 'active' : ''}`} onClick={() => setActiveService('')}>All</button>
          {SERVICE_TYPES.map((s) => (
            <button key={s} className={`pill ${activeService === s ? 'active' : ''}`} onClick={() => setActiveService(s)}>
              {s}
            </button>
          ))}
        </div>

        {loading && <p className="muted">Loading suppliers...</p>}
        {!loading && suppliers.length === 0 && (
          <div className="card">
            <p className="muted">No suppliers found yet. Once service providers onboard in your area, they'll show up here.</p>
          </div>
        )}

        {suppliers.map((s) => (
          <div key={s._id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/customer/supplier/${s._id}`)}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="tanker-card" style={{ width: 70, flexShrink: 0 }}>
                <div className="img-placeholder" style={{ height: 50 }}>🚛</div>
              </div>
              <div style={{ flex: 1 }}>
                <strong>{s.businessName}</strong>
                <p className="muted">⭐ {s.rating?.average || 'New'} {s.rating?.count ? `(${s.rating.count} reviews)` : ''}</p>
                <p className="muted">📍 {s.serviceArea?.areas?.join(', ') || s.serviceArea?.city}</p>
                {s.priceList?.[0] && (
                  <p style={{ color: 'var(--primary)', fontWeight: 700, marginTop: 4 }}>
                    {s.priceList[0].capacity}L - ₹{s.priceList[0].price}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="card" style={{ background: 'var(--primary)', color: '#fff', textAlign: 'center' }}>
          <strong>For Societies & Business</strong>
          <p style={{ fontSize: 12, marginTop: 6, opacity: 0.9 }}>
            Subscribe for monthly water supply. Auto-repeat orders, credit system, usage analytics.
          </p>
          <button className="btn-outline" style={{ marginTop: 10, background: '#fff' }}>View Society Plans</button>
        </div>
      </div>
      <BottomNav role="customer" />
    </>
  );
}
