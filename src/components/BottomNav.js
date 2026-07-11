import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav({ role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const base = role === 'owner' ? '/owner' : '/customer';
  const items = [
    { icon: '🏠', label: 'Home', path: role === 'owner' ? `${base}/dashboard` : `${base}/home` },
    { icon: '📦', label: 'Order', path: role === 'owner' ? `${base}/orders` : `${base}/orders` },
    { icon: '👤', label: 'Profile', path: `${base}/profile` }
  ];

  return (
    <div className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.label}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
