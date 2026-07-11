import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import BottomNav from '../../components/BottomNav';

export default function CustomerProfile() {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [flatNo, setFlatNo] = useState('');
  const [society, setSociety] = useState('');
  const [area, setArea] = useState('');

  const menuItems = [
    { icon: '📦', label: 'Order History', action: () => navigate('/customer/orders') },
    { icon: '🔔', label: 'Notifications', action: () => {} },
    { icon: '⚙️', label: 'Setting', action: () => {} },
    { icon: '🛡️', label: 'Privacy', action: () => {} },
    { icon: '🌐', label: 'Language', action: () => {} }
  ];

  const handleAddAddress = async () => {
    if (!flatNo || !society || !area) return alert('Please fill all fields');
    try {
      const res = await api.addAddress(token, { flatNo, society, area, city: 'Pune', isDefault: !user?.addresses?.length });
      updateUser({ ...user, addresses: res.addresses });
      setShowAddAddress(false);
      setFlatNo(''); setSociety(''); setArea('');
    } catch (e) { alert(e.message); }
  };

  return (
    <>
      <div className="screen">
        <div className="center-flex" style={{ minHeight: 'auto', marginBottom: 20 }}>
          <div className="avatar" style={{ width: 80, height: 80, fontSize: 32 }}>
            {user?.name?.[0]?.toUpperCase() || '👤'}
          </div>
          <h3 style={{ marginTop: 12 }}>{user?.name}</h3>
          <p className="muted">📞 {user?.phone}</p>
          {user?.addresses?.[0] && (
            <p className="muted">📍 {user.addresses[0].flatNo}, {user.addresses[0].society}</p>
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Saved Addresses</strong>
            <span className="link-text" onClick={() => setShowAddAddress(!showAddAddress)}>+ Add</span>
          </div>
          {user?.addresses?.map((a, i) => (
            <p key={i} className="muted" style={{ marginTop: 8 }}>📍 {a.flatNo}, {a.society}, {a.area}</p>
          ))}
          {showAddAddress && (
            <div style={{ marginTop: 12 }}>
              <input className="input-field" placeholder="Flat No." value={flatNo} onChange={(e) => setFlatNo(e.target.value)} />
              <input className="input-field" placeholder="Society Name" value={society} onChange={(e) => setSociety(e.target.value)} />
              <input className="input-field" placeholder="Area" value={area} onChange={(e) => setArea(e.target.value)} />
              <button className="btn-primary" onClick={handleAddAddress}>Save Address</button>
            </div>
          )}
        </div>

        <div className="card" style={{ padding: '4px 16px' }}>
          {menuItems.map((item) => (
            <button key={item.label} className="list-row" onClick={item.action}>
              <span>{item.icon} {item.label}</span>
              <span>›</span>
            </button>
          ))}
        </div>

        <button className="btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => { logout(); navigate('/'); }}>
          Log out
        </button>
      </div>
      <BottomNav role="customer" />
    </>
  );
}
