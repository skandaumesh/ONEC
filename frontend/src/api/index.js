import axiosInstance from './axiosInstance';

export const authApi = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  forgotPassword: (data) => axiosInstance.post('/auth/forgot-password', data),
  verifyOtp: (data) => axiosInstance.post('/auth/verify-otp', data),
  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
};

export const productApi = {
  getAll: (params) => axiosInstance.get('/products', { params }),
  getById: (id) => axiosInstance.get(`/products/${id}`),
  getByCategory: (categoryId, params) => axiosInstance.get(`/products/category/${categoryId}`, { params }),
  search: (query, params) => axiosInstance.get('/products/search', { params: { q: query, ...params } }),
  getFeatured: () => axiosInstance.get('/products/featured'),
  getTopRated: () => axiosInstance.get('/products/top-rated'),
};

export const categoryApi = {
  getAll: () => axiosInstance.get('/categories'),
  getById: (id) => axiosInstance.get(`/categories/${id}`),
};

export const cartApi = {
  get: () => axiosInstance.get('/cart'),
  addItem: (data) => axiosInstance.post('/cart/items', data),
  updateQuantity: (itemId, quantity) => axiosInstance.put(`/cart/items/${itemId}?quantity=${quantity}`),
  removeItem: (itemId) => axiosInstance.delete(`/cart/items/${itemId}`),
  clear: () => axiosInstance.delete('/cart'),
};

export const orderApi = {
  place: (data) => axiosInstance.post('/orders', data),
  getAll: (params) => axiosInstance.get('/orders', { params }),
  getById: (id) => axiosInstance.get(`/orders/${id}`),
  track: (orderNumber) => axiosInstance.get(`/orders/track/${orderNumber}`),
  cancel: (id) => axiosInstance.put(`/orders/${id}/cancel`),
};

export const userApi = {
  getProfile: () => axiosInstance.get('/users/me'),
  updateProfile: (params) => axiosInstance.put('/users/me', null, { params }),
  addAddress: (data) => axiosInstance.post('/users/me/addresses', data),
  deleteAddress: (id) => axiosInstance.delete(`/users/me/addresses/${id}`),
};

export const adminApi = {
  getDashboard: () => axiosInstance.get('/admin/dashboard'),
  createProduct: (data) => axiosInstance.post('/admin/products', data),
  updateProduct: (id, data) => axiosInstance.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => axiosInstance.delete(`/admin/products/${id}`),
  getOrders: (params) => axiosInstance.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => axiosInstance.put(`/admin/orders/${id}/status?status=${status}`),
  getUsers: () => axiosInstance.get('/admin/users'),
  updateUserRole: (id, role) => axiosInstance.put(`/admin/users/${id}/role?role=${role}`),
  toggleUserEnabled: (id) => axiosInstance.put(`/admin/users/${id}/toggle-enabled`),
  toggleProductActive: (id) => axiosInstance.put(`/admin/products/${id}/toggle-active`),
};

export const paymentApi = {
  createRazorpayOrder: (orderId) => axiosInstance.post(`/payments/create-order?orderId=${orderId}`),
  verifyRazorpayPayment: (data) => axiosInstance.post('/payments/verify', data),
  completeCodPayment: (orderId) => axiosInstance.post(`/payments/cod?orderId=${orderId}`),
};

export const discountApi = {
  getAll: () => axiosInstance.get('/admin/discounts'),
  create: (data) => axiosInstance.post('/admin/discounts', data),
  update: (id, data) => axiosInstance.put(`/admin/discounts/${id}`, data),
  delete: (id) => axiosInstance.delete(`/admin/discounts/${id}`),
  validate: (code, amount) => axiosInstance.get(`/discounts/validate?code=${code}&amount=${amount}`),
};

export const reviewApi = {
  getByProduct: (productId) => axiosInstance.get(`/reviews/product/${productId}`),
  submit: (data) => axiosInstance.post('/reviews', data),
  getAll: () => axiosInstance.get('/admin/reviews'),
  delete: (id) => axiosInstance.delete(`/admin/reviews/${id}`),
};

export const inventoryApi = {
  getAll: () => axiosInstance.get('/admin/inventory'),
  getLowStock: () => axiosInstance.get('/admin/inventory/low-stock'),
  getExpiring: () => axiosInstance.get('/admin/inventory/expiring'),
  restock: (productId, quantity) => axiosInstance.put(`/admin/inventory/${productId}/restock?quantity=${quantity}`),
  updateExpiry: (productId, date) => axiosInstance.put(`/admin/inventory/${productId}/expiry?expiryDate=${date}`),
};

// Add to adminApi
adminApi.getSalesReport = (period) => axiosInstance.get(`/admin/sales-report?period=${period}`);
adminApi.getRecommendations = () => axiosInstance.get('/admin/recommendations');


