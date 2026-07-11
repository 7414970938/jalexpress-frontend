import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';
import BottomNav from '../../components/BottomNav';

export default function SupplierDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    api.getSupplierDetail(token, id).then((res) => setSupplier(res.supplier)).catch(console.error);
    // eslint-disable-next-line
  }, [id]);

  if (!supplier) return <div className="screen">Loading...</div>;

  const groupedPrices = supplier.priceList.reduce((acc, p) => {
    acc[p.serviceType] = acc[p.serviceType] || [];
    acc[p.serviceType].push(p);
    return acc;
  }, {});

  return (
    <>
      <div className="screen">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 10 }}>
          <div className="avatar">🚛</div>
          <div>
            <strong style={{ fontSize: 18, color: 'var(--primary)' }}>{supplier.businessName}</strong>
            <p className="muted">⭐ {supplier.rating?.average || 'New'} ({supplier.rating?.count || 0} reviews)</p>
            <p className="muted">📍 {supplier.serviceArea?.areas?.join(', ')}</p>
          </div>
        </div>

        <div className="pill-group" style={{ marginTop: 16 }}>
          {supplier.badges?.verifiedWater && <span className="pill active">✓ Verified Water</span>}
          {supplier.badges?.trustedSupplier && <span className="pill active">✓ Trusted Supplier</span>}
          {supplier.badges?.fastDelivery && <span className="pill active">⚡ Fast Delivery</span>}
        </div>

        {supplier.about && (
          <div className="card">
            <strong>About</strong>
            <p className="muted" style={{ marginTop: 6 }}>{supplier.about}</p>
          </div>
        )}

        <div className="card">
          <strong>Services</strong>
          <div className="tanker-grid" style={{ marginTop: 10 }}>
            {supplier.servicesOffered.map((s) => (
              <div key={s} className="tanker-card">
                <div className="img-placeholder">🚛</div>
                <div className="name">{s}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <strong>Tanker Price List</strong>
          {Object.entries(groupedPrices).map(([type, prices]) => (
            <div key={type} style={{ marginTop: 10 }}>
              <p style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>{type}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {prices.map((p, i) => (
                  <div key={i} className="tanker-card" style={{ minWidth: 80 }}>
                    <div className="name">{p.capacity}L</div>
                    <div className="price">₹{p.price}</div>
                    <div className="eta">⏱ {p.estimatedDeliveryMins} mins</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={() => navigate(`/customer/book/${supplier._id}`)}>
          Book Tanker
        </button>
      </div>
      <BottomNav role="customer" />
    </>
  );
}
