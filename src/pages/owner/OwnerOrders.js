import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import BottomNav from '../../components/BottomNav';

const TABS = [
  { key: '', label: 'All' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' }
];

const NEXT_STATUS = {
  booked: 'accepted',
  accepted: 'in_transit',
  in_transit: 'delivered'
};
const NEXT_LABEL = {
  booked: 'Accept Order',
  accepted: 'Start Delivery',
  in_transit: 'Mark Delivered'
};

export default function OwnerOrders() {
  const { token } = useAuth();
  const [tab, setTab] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getOwnerOrders(token, tab);
      setOrders(res.orders);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [tab]); // eslint-disable-line

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.updateOrderStatus(token, orderId, status);
      load();
    } catch (e) { alert(e.message); }
  };

  const handleReject = async (orderId) => {
    if (!window.confirm('Reject this order?')) return;
    try {
      await api.updateOrderStatus(token, orderId, 'rejected');
      load();
    } catch (e) { alert(e.message); }
  };

  return (
    <>
      <div className="screen">
        <h2 style={{ color: 'var(--primary)', marginBottom: 16 }}>Orders</h2>

        <div className="pill-group">
          {TABS.map((t) => (
            <button key={t.key} className={`pill ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>

        {loading && <p className="muted">Loading...</p>}
        {!loading && orders.length === 0 && <p className="muted">No orders here.</p>}

        {orders.map((o) => (
          <div key={o._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className={`badge badge-${o.status}`}>{o.status.replace('_', ' ')}</span>
              <strong>₹{o.price}</strong>
            </div>
            <p style={{ fontWeight: 700, marginTop: 8 }}>{o.customer?.name}</p>
            <p className="muted">📞 {o.customer?.phone}</p>
            <p className="muted">{o.tankerSize}L {o.serviceType}</p>
            <p className="muted">📍 {o.deliveryAddress?.flatNo}, {o.deliveryAddress?.city}</p>
            <p className="muted">{new Date(o.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>

            {NEXT_STATUS[o.status] && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="btn-primary" style={{ padding: 10, fontSize: 13 }} onClick={() => handleUpdateStatus(o._id, NEXT_STATUS[o.status])}>
                  {NEXT_LABEL[o.status]}
                </button>
                {o.status === 'booked' && (
                  <button className="btn-outline" style={{ padding: 10, fontSize: 13, color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleReject(o._id)}>
                    Reject
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <BottomNav role="owner" />
    </>
  );
}
