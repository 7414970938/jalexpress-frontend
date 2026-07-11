import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function BookingConfirmed() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="screen center-flex">
      <div style={{ fontSize: 70 }}>✅</div>
      <h2 style={{ color: 'var(--primary)', marginTop: 16 }}>Successfully Booked</h2>
      <p className="muted" style={{ marginTop: 8 }}>
        We've notified the supplier. You'll receive a payment request on WhatsApp shortly.
      </p>

      <div style={{ display: 'flex', gap: 12, marginTop: 30, width: '100%' }}>
        <button className="btn-outline" onClick={() => navigate('/customer/orders')}>Order History</button>
        <button className="btn-primary" onClick={() => navigate(`/customer/orders/${orderId}`)}>Track Order</button>
      </div>
    </div>
  );
}
