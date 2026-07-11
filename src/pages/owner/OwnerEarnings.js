import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import BottomNav from '../../components/BottomNav';

const PERIODS = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'last7days', label: 'Last 7 days' },
  { key: 'lastmonth', label: 'Last month' }
];

export default function OwnerEarnings() {
  const { token } = useAuth();
  const [period, setPeriod] = useState('today');
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getEarnings(token, period).then(setData).catch(console.error);
  }, [token, period]);

  return (
    <>
      <div className="screen">
        <h2 style={{ color: 'var(--primary)', marginBottom: 16 }}>Earning</h2>

        <div className="pill-group">
          {PERIODS.map((p) => (
            <button key={p.key} className={`pill ${period === p.key ? 'active' : ''}`} onClick={() => setPeriod(p.key)}>{p.label}</button>
          ))}
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--primary)' }}>₹{data?.totalEarning ?? 0}</div>
          <p className="muted">{PERIODS.find(p => p.key === period)?.label} Earning</p>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <div className="val">{data?.tripsCompleted ?? 0}</div>
            <div className="lbl">Trips Completed</div>
          </div>
          <div className="stat-card">
            <div className="val">₹{data?.avgPerTrip ?? 0}</div>
            <div className="lbl">Avg per Trip</div>
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
