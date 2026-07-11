import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/api';

export default function BookTanker() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState(null);
  const [serviceType, setServiceType] = useState('Drinking Water');
  const [tankerSize, setTankerSize] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('whatsapp_qr');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getSupplierDetail(token, id).then((res) => {
      setSupplier(res.supplier);
      const defaultAddr = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];
      if (defaultAddr) {
        setAddress(`${defaultAddr.flatNo}, ${defaultAddr.society}, ${defaultAddr.area}, ${defaultAddr.city}`);
      }
    }).catch(console.error);
    // eslint-disable-next-line
  }, [id]);

  if (!supplier) return <div className="screen">Loading...</div>;

  const sizesForService = supplier.priceList.filter(p => p.serviceType === serviceType);

  const handleSizeChange = (size) => {
    setTankerSize(size);
    const matched = sizesForService.find(p => String(p.capacity) === String(size));
    if (matched) setPrice(matched.price);
  };

  const handleBook = async () => {
    setError('');
    if (!tankerSize || !price || !address || !contact) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await api.bookOrder(token, {
        owner: supplier._id,
        serviceType,
        tankerSize: Number(tankerSize),
        price: Number(price),
        deliveryAddress: { flatNo: address, city: 'Pune' },
        contactNumber: contact,
        paymentMethod
      });
      navigate(`/customer/booking-confirmed/${res.order._id}`);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="screen">
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>
      <h2 style={{ color: 'var(--primary)', marginBottom: 20 }}>Book Tanker</h2>

      <label className="field-label">Select Tanker Type</label>
      <div className="pill-group">
        {supplier.servicesOffered.map((s) => (
          <button key={s} className={`pill ${serviceType === s ? 'active' : ''}`} onClick={() => { setServiceType(s); setTankerSize(''); setPrice(''); }}>
            {s}
          </button>
        ))}
      </div>

      <label className="field-label">Select Tanker Size</label>
      <select className="input-field" value={tankerSize} onChange={(e) => handleSizeChange(e.target.value)}>
        <option value="">Choose size</option>
        {sizesForService.map((p, i) => (
          <option key={i} value={p.capacity}>{p.capacity} L</option>
        ))}
      </select>

      <label className="field-label">Price</label>
      <input className="input-field" value={price ? `₹${price}` : ''} readOnly />

      <label className="field-label">Address</label>
      <input className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Flat/Society/Area" />

      <label className="field-label">Contact number</label>
      <input className="input-field" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+91" />

      <label className="field-label">Payment Method</label>
      <div className="card" style={{ padding: 12 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer' }}>
          <input type="radio" checked={paymentMethod === 'whatsapp_qr'} onChange={() => setPaymentMethod('whatsapp_qr')} />
          💬 Pay via WhatsApp (QR code sent after booking)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer' }}>
          <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
          💵 Cash on Delivery
        </label>
      </div>

      {error && <p className="error-text">{error}</p>}

      <button className="btn-primary" onClick={handleBook} disabled={loading}>
        {loading ? 'Booking...' : 'Confirm Booking'}
      </button>
    </div>
  );
}
