import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import BottomNav from '../../components/BottomNav';

const TABS = [
  { key: '', label: 'All' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' }
];

export default function MyOrders() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getMyOrders(token, tab);
      setOrders(res.orders);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [tab]); // eslint-disable-line

  const handleReorder = async (e, orderId) => {
    e.stopPropagation();
    try {
      await api.reorder(token, orderId);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="screen">
        <div className="top-bar" style={{ padding: 0, border: 'none', marginBottom: 16 }}>
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h2>My Orders</h2>
        </div>

        <div className="pill-group">
          {TABS.map((t) => (
            <button key={t.key} className={`pill ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>

        {loading && <p className="muted">Loading...</p>}
        {!loading && orders.length === 0 && <p className="muted">No orders here yet.</p>}

        {orders.map((o) => (
          <div key={o._id} className="card" onClick={() => navigate(`/customer/orders/${o._id}`)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className={`badge badge-${o.status}`}>{o.status.replace('_', ' ')}</span>
              <strong>₹{o.price}</strong>
            </div>
            <p style={{ fontWeight: 700, marginTop: 8 }}>{o.owner?.businessName}</p>
            <p className="muted">{o.tankerSize}L {o.serviceType}</p>
            <p className="muted">{new Date(o.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>

            {o.status === 'delivered' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn-outline" style={{ padding: 8, fontSize: 12 }} onClick={(e) => handleReorder(e, o._id)}>Reorder</button>
                {!o.rating?.stars && (
                  <button className="btn-outline" style={{ padding: 8, fontSize: 12 }} onClick={(e) => { e.stopPropagation(); navigate(`/customer/orders/${o._id}`); }}>Rate</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <BottomNav role="customer" />
    </>
  );
}
