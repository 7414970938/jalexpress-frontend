import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';

const COMMON_SIZES = [3000, 5000, 8000, 10000, 12000];

export default function OwnerPriceList() {
  const { token, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState(
    (user?.servicesOffered || []).flatMap((service) =>
      COMMON_SIZES.slice(0, 2).map((size) => ({ serviceType: service, capacity: size, price: '', estimatedDeliveryMins: 45 }))
    )
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateRow = (i, field, value) => {
    setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  };

  const handleSave = async () => {
    setError('');
    const filled = rows.filter(r => r.price);
    if (filled.length === 0) {
      setError('Please set price for at least one tanker size');
      return;
    }
    setLoading(true);
    try {
      const res = await api.updatePriceList(token, filled.map(r => ({ ...r, capacity: Number(r.capacity), price: Number(r.price) })));
      updateUser({ ...user, priceList: res.priceList });
      navigate('/owner/dashboard');
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="screen">
      <h2 style={{ color: 'var(--primary)', marginBottom: 6 }}>Set Your Prices</h2>
      <p className="muted" style={{ marginBottom: 20 }}>Customers will see these prices when booking. You can update anytime.</p>

      {rows.map((row, i) => (
        <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 13 }}>{row.serviceType}</p>
            <p className="muted" style={{ fontSize: 12 }}>{row.capacity} L</p>
          </div>
          <input
            className="input-field"
            style={{ width: 100, marginBottom: 0 }}
            placeholder="₹ Price"
            value={row.price}
            onChange={(e) => updateRow(i, 'price', e.target.value.replace(/\D/g, ''))}
          />
        </div>
      ))}

      {error && <p className="error-text">{error}</p>}

      <button className="btn-primary" onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save & Go to Dashboard'}
      </button>
    </div>
  );
}
