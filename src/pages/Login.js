import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { role } = useParams(); // 'customer' or 'owner'
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState('phone'); // phone -> otp -> name (if new)
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    setError('');
    if (!/^\d{10}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await api.sendOtp(phone, role);
      setDevOtp(res.devOtp || '');
      setStep('otp');
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (otp.length !== 4) {
      setError('Enter the 4-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await api.verifyOtp(phone, otp, role, name || undefined);
      login(res.token, role, res.user);

      if (role === 'owner') {
        navigate(res.isNewAccount ? '/owner/onboarding' : '/owner/dashboard');
      } else {
        navigate('/customer/home');
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="screen" style={{ paddingBottom: 20 }}>
      <div className="brand-logo">
        <div className="drop">💧</div>
        <h1>JalExpress</h1>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Welcome Back!</h2>

      {step === 'phone' && (
        <>
          <label className="field-label">Enter Mobile Number</label>
          <input
            className="input-field"
            placeholder="+91 9876543210"
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          />
          {error && <p className="error-text">{error}</p>}
          <button className="btn-primary" onClick={handleSendOtp} disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      )}

      {step === 'otp' && (
        <>
          <label className="field-label">Enter OTP</label>
          <input
            className="input-field"
            placeholder="4-digit OTP"
            value={otp}
            maxLength={4}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          />
          <p className="muted" style={{ marginTop: -10, marginBottom: 16 }}>
            OTP sent to +91 {phone} {devOtp && `(dev mode: ${devOtp})`}
          </p>

          <label className="field-label">Your Name (for first-time login)</label>
          <input
            className="input-field"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}
          <button className="btn-primary" onClick={handleVerifyOtp} disabled={loading}>
            {loading ? 'Verifying...' : 'Log in'}
          </button>
        </>
      )}

      <p className="muted" style={{ textAlign: 'center', marginTop: 24 }}>
        By continuing, you agree to our Terms & Conditions and Privacy Policy
      </p>
    </div>
  );
}
