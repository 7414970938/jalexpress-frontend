import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import BottomNav from '../../components/BottomNav';

export default function OwnerDashboard() {
  const { token, user, updateUser } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [isOnline, setIsOnline] = useState(user?.isOnline || false);

  useEffect(() => {
    api.getDashboard(token).then((res) => setDashboard(res.dashboard)).catch(console.error);
  }, [token]);

  const handleToggleOnline = async () => {
    try {
      const res = await api.toggleOnline(token, !isOnline);
      setIsOnline(res.isOnline);
      updateUser({ ...user, isOnline: res.isOnline });
    } catch (e) { alert(e.message); }
  };

  return (
    <>
      <div className="screen">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div className="avatar">{user?.ownerName?.[0]?.toUpperCase() || '👤'}</div>
          <div style={{ flex: 1 }}>
            <strong>Hello, {user?.ownerName}</strong>
            <p className="muted">{user?.businessName}</p>
          </div>
          <button
            className="pill"
            style={{ background: isOnline ? 'var(--success)' : 'var(--border)', color: isOnline ? '#fff' : 'var(--text-muted)' }}
            onClick={handleToggleOnline}
          >
            {isOnline ? '🟢 Online' : '⚪ Offline'}
          </button>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <div className="val">₹{dashboard?.earned ?? '—'}</div>
            <div className="lbl">Earned</div>
          </div>
          <div className="stat-card">
            <div className="val">{dashboard?.orders ?? '—'}</div>
            <div className="lbl">Orders</div>
          </div>
          <div className="stat-card">
            <div className="val">{dashboard?.deliveries ?? '—'}</div>
            <div className="lbl">Deliveries</div>
          </div>
          <div className="stat-card">
            <div className="val">{dashboard?.rating ?? '—'}</div>
            <div className="lbl">Rating</div>
          </div>
        </div>

        <div className="card">
          <strong>Performance overview</strong>
          <p className="muted" style={{ marginBottom: 10 }}>This week vs last week</p>
          <div style={{ height: 100, background: 'var(--bg-soft)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="muted">📈 Chart appears once you have delivery history</span>
          </div>
        </div>
      </div>
      <BottomNav role="owner" />
    </>
  );
}
