import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState('customer');

  return (
    <div className="screen" style={{ paddingBottom: 20 }}>
      <div className="brand-logo">
        <div className="drop">💧</div>
        <h1>JalExpress</h1>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 30 }}>
        Water tankers, delivered fast. Choose how you'd like to continue.
      </p>

      <div
        className="card"
        style={{
          display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          borderColor: selected === 'customer' ? 'var(--primary)' : 'var(--border)',
          borderWidth: selected === 'customer' ? 2 : 1
        }}
        onClick={() => setSelected('customer')}
      >
        <input type="radio" checked={selected === 'customer'} onChange={() => setSelected('customer')} />
        <div>
          <strong>CUSTOMER</strong>
          <p className="muted">Order a water tanker for your home, society or business</p>
        </div>
      </div>

      <div
        className="card"
        style={{
          display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          borderColor: selected === 'owner' ? 'var(--primary)' : 'var(--border)',
          borderWidth: selected === 'owner' ? 2 : 1
        }}
        onClick={() => setSelected('owner')}
      >
        <input type="radio" checked={selected === 'owner'} onChange={() => setSelected('owner')} />
        <div>
          <strong>SERVICE PROVIDER</strong>
          <p className="muted">Onboard your tanker business and start getting orders</p>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <button className="btn-primary" onClick={() => navigate(`/login/${selected}`)}>
          Continue
        </button>
      </div>
    </div>
  );
}
