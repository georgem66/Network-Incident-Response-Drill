import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

// Scenario services
export const scenarioService = {
  getAll: (params) => api.get('/scenarios', { params }),
  getById: (id) => api.get(`/scenarios/${id}`),
  getHints: (id, step) => api.get(`/scenarios/${id}/hints`, { params: { step } }),
};

// Incident services
export const incidentService = {
  start: (scenarioId) => api.post('/incidents', { scenarioId }),
  getAll: (params) => api.get('/incidents', { params }),
  getById: (id) => api.get(`/incidents/${id}`),
  updateStep: (id, data) => api.put(`/incidents/${id}/step`, data),
  useHint: (id) => api.post(`/incidents/${id}/hint`),
};

// Tools services
export const toolsService = {
  getWiresharkData: (params) => api.get('/tools/wireshark', { params }),
  getSuricataAlerts: (params) => api.get('/tools/suricata', { params }),
  getSyslogData: (params) => api.get('/tools/syslog', { params }),
};

// Scores services
export const scoresService = {
  getLeaderboard: (params) => api.get('/scores/leaderboard', { params }),
  getUserScores: () => api.get('/scores/user'),
};

// User services
export const userService = {
  getProfile: () => api.get('/users/profile'),
  getAllUsers: () => api.get('/users'),
};

export default api;