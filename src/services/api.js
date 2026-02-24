import axios from 'axios';

const API_BASE_URL = procces.env.backendurl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add authentication token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services
export const serviceAPI = {
  getAll: () => api.get('/admin/services'),
  getById: (id) => api.get(`/admin/services/${id}`),
  
  // For regular JSON data
  create: (data) => api.post('/admin/services', data),
  
  // For FormData (with images)
  createWithImage: (formData) => api.post('/admin/services', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // For regular JSON updates
  update: (id, data) => api.put(`/admin/services/${id}`, data),
  
  // For FormData updates (with images)
  updateWithImage: (id, formData) => api.post(`/admin/services/${id}?_method=PUT`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  delete: (id) => api.delete(`/admin/services/${id}`),
};

// Reservations
export const reservationAPI = {
  // Public (for frontend booking form)
  create: (data) => api.post('/reservations', data),
  getById: (id) => api.get(`/reservations/${id}`),
  
  // Admin
  getAll: () => api.get('/admin/reservations'),
  update: (id, data) => api.put(`/admin/reservations/${id}`, data),
  delete: (id) => api.delete(`/admin/reservations/${id}`),
  filterByStatus: (status) => api.get(`/admin/reservations/status/${status}`),
  getUpcoming: () => api.get('/admin/reservations/upcoming'),
  
  // Image Management - Add these methods
 getImages: (reservationId) => api.get(`/admin/reservations/${reservationId}/images`),
uploadImages: (reservationId, formData) => api.post(`/admin/reservations/${reservationId}/images`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}),
getImageStats: (reservationId) => api.get(`/admin/reservations/${reservationId}/images/stats`),

  getImageStats: async (reservationId) => {
    try {
      const response = await api.get(`/api/reservations/${reservationId}/images/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching image stats:', error);
      throw error;
    }
  },
};

// Images - Keep for other image operations
export const imageAPI = {
  getByReservation: (reservationId) => 
    api.get(`/admin/images/reservation/${reservationId}`),
  
  uploadToReservation: (reservationId, formData) =>
    api.post(`/admin/images/reservation/${reservationId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  update: (id, data) => api.put(`/admin/images/${id}`, data),
  
  delete: (id) => api.delete(`/admin/images/${id}`),
  
  bulkDelete: (imageIds) => 
    api.post('/admin/images/bulk-delete', { image_ids: imageIds }),
  
  getStats: (reservationId) => 
    api.get(`/admin/images/stats/${reservationId}`),
};

// Authentication
export const authAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  logout: () => api.post('/admin/logout'),
  getProfile: () => api.get('/admin/profile'),
};

export default api;