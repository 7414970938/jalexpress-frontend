import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';

const STEPS = ['booked', 'accepted', 'in_transit', 'delivered'];

export default function OrderTracking() {
  const { orderId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState('');

  const load = async () => {
    try {
      const res = await api.getOrderDetail(token, orderId);
      setOrder(res.order);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, [orderId]); // eslint-disable-line

  if (!order) return <div className="screen">Loading...</div>;

  const currentStepIndex = STEPS.indexOf(order.status);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await api.cancelOrder(token, orderId);
      load();
    } catch (e) { alert(e.message); }
  };

  const handleRate = async () => {
    if (!stars) return alert('Please select stars');
    try {
      await api.rateOrder(token, orderId, stars, review);
      load();
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="screen">
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>
      <h2 style={{ color: 'var(--primary)', marginTop: 10 }}>Order #{order.orderNumber}</h2>

      <div className="card">
        <span className={`badge badge-${order.status}`}>{order.status.replace('_', ' ')}</span>
        <p style={{ fontWeight: 700, marginTop: 10 }}>{order.owner?.businessName}</p>
        <p className="muted">{order.tankerSize}L {order.serviceType} — ₹{order.price}</p>
        <p className="muted">📍 {order.deliveryAddress?.flatNo}, {order.deliveryAddress?.city}</p>
        <p className="muted">📞 {order.contactNumber}</p>
      </div>

      {order.status !== 'cancelled' && order.status !== 'rejected' && (
        <div className="card">
          <strong>Status</strong>
          <div style={{ marginTop: 12 }}>
            {STEPS.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, opacity: i <= currentStepIndex ? 1 : 0.4 }}>
                <span style={{ fontSize: 18 }}>{i <= currentStepIndex ? '✅' : '⚪'}</span>
                <span style={{ textTransform: 'capitalize' }}>{step.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {order.status === 'delivered' && !order.rating?.stars && (
        <div className="card">
          <strong>Rate this delivery</strong>
          <div style={{ marginTop: 10, fontSize: 26 }}>
            {[1,2,3,4,5].map((n) => (
              <span key={n} onClick={() => setStars(n)} style={{ cursor: 'pointer', color: n <= stars ? '#E0A82E' : '#ccc' }}>★</span>
            ))}
          </div>
          <textarea className="input-field" style={{ marginTop: 10 }} placeholder="Write a review (optional)" value={review} onChange={(e) => setReview(e.target.value)} />
          <button className="btn-primary" onClick={handleRate}>Submit Rating</button>
        </div>
      )}

      {order.rating?.stars && (
        <div className="card">
          <strong>Your Rating</strong>
          <p style={{ marginTop: 6, color: '#E0A82E' }}>{'★'.repeat(order.rating.stars)}{'☆'.repeat(5 - order.rating.stars)}</p>
          {order.rating.review && <p className="muted" style={{ marginTop: 6 }}>{order.rating.review}</p>}
        </div>
      )}

      {['booked', 'accepted'].includes(order.status) && (
        <button className="btn-outline" onClick={handleCancel}>Cancel Order</button>
      )}
    </div>
  );
}
