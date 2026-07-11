import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';

export default function OwnerProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: '📦', label: 'Order History', action: () => navigate('/owner/orders') },
    { icon: '💰', label: 'Earnings Summary', action: () => navigate('/owner/earnings') },
    { icon: '💧', label: 'Price List', action: () => navigate('/owner/price-list') },
    { icon: '🔔', label: 'Notifications', action: () => {} },
    { icon: '⚙️', label: 'Setting', action: () => {} },
    { icon: '🛡️', label: 'Privacy', action: () => {} },
    { icon: '🌐', label: 'Language', action: () => {} },
    { icon: '❓', label: 'Help & Support', action: () => {} },
    { icon: '📞', label: 'Contact Us', action: () => {} },
    { icon: '🚛', label: 'Vehicle Details', action: () => {} }
  ];

  return (
    <>
      <div className="screen">
        <div className="center-flex" style={{ minHeight: 'auto', marginBottom: 20 }}>
          <div className="avatar" style={{ width: 80, height: 80, fontSize: 32 }}>
            {user?.ownerName?.[0]?.toUpperCase() || '👤'}
          </div>
          <h3 style={{ marginTop: 12 }}>Hello, {user?.ownerName}</h3>
          <p className="muted">📞 {user?.phone}</p>
          <p className="muted">{user?.businessName}</p>
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
      <BottomNav role="owner" />
    </>
  );
}
