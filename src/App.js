import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import RoleSelect from './pages/RoleSelect';
import Login from './pages/Login';

import CustomerHome from './pages/customer/CustomerHome';
import SupplierDetail from './pages/customer/SupplierDetail';
import BookTanker from './pages/customer/BookTanker';
import BookingConfirmed from './pages/customer/BookingConfirmed';
import MyOrders from './pages/customer/MyOrders';
import OrderTracking from './pages/customer/OrderTracking';
import CustomerProfile from './pages/customer/CustomerProfile';

import OwnerOnboarding from './pages/owner/OwnerOnboarding';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerOrders from './pages/owner/OwnerOrders';
import OwnerEarnings from './pages/owner/OwnerEarnings';
import OwnerProfile from './pages/owner/OwnerProfile';
import OwnerPriceList from './pages/owner/OwnerPriceList';

function ProtectedRoute({ children, requiredRole }) {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="app-shell">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelect />} />
          <Route path="/login/:role" element={<Login />} />

          {/* Customer routes */}
          <Route path="/customer/home" element={<ProtectedRoute requiredRole="customer"><CustomerHome /></ProtectedRoute>} />
          <Route path="/customer/supplier/:id" element={<ProtectedRoute requiredRole="customer"><SupplierDetail /></ProtectedRoute>} />
          <Route path="/customer/book/:id" element={<ProtectedRoute requiredRole="customer"><BookTanker /></ProtectedRoute>} />
          <Route path="/customer/booking-confirmed/:orderId" element={<ProtectedRoute requiredRole="customer"><BookingConfirmed /></ProtectedRoute>} />
          <Route path="/customer/orders" element={<ProtectedRoute requiredRole="customer"><MyOrders /></ProtectedRoute>} />
          <Route path="/customer/orders/:orderId" element={<ProtectedRoute requiredRole="customer"><OrderTracking /></ProtectedRoute>} />
          <Route path="/customer/profile" element={<ProtectedRoute requiredRole="customer"><CustomerProfile /></ProtectedRoute>} />

          {/* Owner routes */}
          <Route path="/owner/onboarding" element={<ProtectedRoute requiredRole="owner"><OwnerOnboarding /></ProtectedRoute>} />
          <Route path="/owner/dashboard" element={<ProtectedRoute requiredRole="owner"><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/owner/orders" element={<ProtectedRoute requiredRole="owner"><OwnerOrders /></ProtectedRoute>} />
          <Route path="/owner/earnings" element={<ProtectedRoute requiredRole="owner"><OwnerEarnings /></ProtectedRoute>} />
          <Route path="/owner/profile" element={<ProtectedRoute requiredRole="owner"><OwnerProfile /></ProtectedRoute>} />
          <Route path="/owner/price-list" element={<ProtectedRoute requiredRole="owner"><OwnerPriceList /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
