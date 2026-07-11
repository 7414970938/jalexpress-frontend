const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

export const api = {
  sendOtp: (phone, role) => request('/auth/send-otp', { method: 'POST', body: { phone, role } }),
  verifyOtp: (phone, otp, role, name) => request('/auth/verify-otp', { method: 'POST', body: { phone, otp, role, name } }),

  // Customer
  getMyProfile: (token) => request('/customer/me', { token }),
  updateCustomerProfile: (token, body) => request('/customer/profile', { method: 'PUT', body, token }),
  addAddress: (token, body) => request('/customer/address', { method: 'POST', body, token }),
  getSuppliers: (token, params = '') => request(`/customer/suppliers${params}`, { token }),
  getSupplierDetail: (token, id) => request(`/customer/suppliers/${id}`, { token }),

  // Owner
  getOwnerProfile: (token) => request('/owner/me', { token }),
  updateOwnerProfile: (token, body) => request('/owner/profile', { method: 'PUT', body, token }),
  updatePriceList: (token, priceList) => request('/owner/price-list', { method: 'PUT', body: { priceList }, token }),
  toggleOnline: (token, isOnline) => request('/owner/online-status', { method: 'PUT', body: { isOnline }, token }),
  getDashboard: (token) => request('/owner/dashboard', { token }),
  getOwnerOrders: (token, status) => request(`/owner/orders${status ? `?status=${status}` : ''}`, { token }),
  updateOrderStatus: (token, orderId, status) => request(`/owner/orders/${orderId}/status`, { method: 'PUT', body: { status }, token }),
  getEarnings: (token, period) => request(`/owner/earnings?period=${period}`, { token }),

  // Orders
  bookOrder: (token, body) => request('/orders', { method: 'POST', body, token }),
  getMyOrders: (token, status) => request(`/orders/my${status ? `?status=${status}` : ''}`, { token }),
  getOrderDetail: (token, id) => request(`/orders/${id}`, { token }),
  cancelOrder: (token, id) => request(`/orders/${id}/cancel`, { method: 'PUT', token }),
  reorder: (token, id) => request(`/orders/${id}/reorder`, { method: 'POST', token }),
  rateOrder: (token, id, stars, review) => request(`/orders/${id}/rate`, { method: 'POST', body: { stars, review }, token })
};
