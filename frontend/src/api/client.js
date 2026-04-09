import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('eyecare_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  login: (payload) => client.post('/auth/login', payload),
  register: (payload) => client.post('/auth/register', payload),
  getMe: () => client.get('/auth/me'),

  getProducts: (params) => client.get('/products', { params }),
  getProductById: (id) => client.get(`/products/${id}`),

  getCart: () => client.get('/cart'),
  upsertCartItem: (payload) => client.put('/cart/items', payload),
  removeCartItem: (productId) => client.delete(`/cart/items/${productId}`),
  clearCart: () => client.delete('/cart/clear'),

  checkout: (payload) => client.post('/orders/checkout', payload),
  getMyOrders: () => client.get('/orders/my'),
  getOrderById: (orderId) => client.get(`/orders/${orderId}`),

  getReviewsByProduct: (productId) => client.get(`/reviews/product/${productId}`),
  postReview: (productId, payload) => client.post(`/reviews/product/${productId}`, payload),

  submitFeedback: (payload) => client.post('/feedback', payload),
  getBranches: () => client.get('/maps/branches'),

  adminCreateProduct: (payload) => client.post('/admin/products', payload),
  adminUploadProductImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return client.post('/admin/products/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  adminUpdateProduct: (id, payload) => client.put(`/admin/products/${id}`, payload),
  adminDeleteProduct: (id) => client.delete(`/admin/products/${id}`),
  adminGetUsers: () => client.get('/admin/users'),
  adminGetOrders: (params) => client.get('/admin/orders', { params }),
  adminUpdateOrderStatus: (orderId, payload) => client.patch(`/admin/orders/${orderId}/status`, payload),
};

export default client;
