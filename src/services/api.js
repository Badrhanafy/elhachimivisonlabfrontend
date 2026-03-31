import axios from 'axios';

const API_BASE_URL = process.env.backendurl || "https://server.elhachimivisionlab.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

console.log('API URL:', API_BASE_URL);

// =====================
// Interceptors
// =====================

// Add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =====================
// SERVICES API
// =====================

export const serviceAPI = {
  getAll: () => api.get('/admin/services'),
  getById: (id) => api.get(`/admin/services/${id}`),

  create: (data) => api.post('/admin/services', data),

  createWithImage: (formData) =>
    api.post('/admin/services', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id, data) => api.put(`/admin/services/${id}`, data),

  updateWithImage: (id, formData) =>
    api.post(`/admin/services/${id}?_method=PUT`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id) => api.delete(`/admin/services/${id}`),
};

// =====================
// RESERVATIONS API
// =====================

export const reservationAPI = {
  // Public
  create: (data) => api.post('/reservations', data),
  getById: (id) => api.get(`/reservations/${id}`),

  // Admin
  getAll: () => api.get('/admin/reservations'),
  update: (id, data) => api.put(`/admin/reservations/${id}`, data),
  delete: (id) => api.delete(`/admin/reservations/${id}`),
  filterByStatus: (status) => api.get(`/admin/reservations/status/${status}`),
  getUpcoming: () => api.get('/admin/reservations/upcoming'),

  // =====================
  // IMAGES (🔥 المهم)
  // =====================

  // Get images
  getImages: (reservationId) =>
    api.get(`/admin/reservations/${reservationId}/images`),

  // Upload images
  uploadImages: (reservationId, formData) =>
    api.post(`/admin/reservations/${reservationId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Stats
  getImageStats: (reservationId) =>
    api.get(`/admin/reservations/${reservationId}/images/stats`),

  // ✅ Delete single image
  deleteImage: (id) =>
    api.delete(`/admin/images/${id}`),

  // ✅ Delete multiple images
  deleteImagesBulk: (imageIds) =>
    api.post(`/admin/images/bulk-delete`, {
      image_ids: imageIds,
    }),
};

// =====================
// IMAGE API (optional)
// =====================

export const imageAPI = {
  delete: (id) => api.delete(`/admin/images/${id}`),

  bulkDelete: (imageIds) =>
    api.post(`/admin/images/bulk-delete`, {
      image_ids: imageIds,
    }),
};

// =====================
// AUTH API
// =====================

export const authAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  logout: () => api.post('/admin/logout'),
  getProfile: () => api.get('/admin/profile'),
};

export default api;