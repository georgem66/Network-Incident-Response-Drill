import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export const apiService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  getScenarios: (params) => api.get('/scenarios', { params }),
  getScenario: (id) => api.get(`/scenarios/${id}`),
  getHints: (id, step) => api.get(`/scenarios/${id}/hints`, { params: { step } }),
  startIncident: (scenarioId) => api.post('/incidents', { scenarioId }),
  getIncidents: (params) => api.get('/incidents', { params }),
  getIncidentAttempt: (id) => api.get(`/incidents/${id}`),
  updateIncidentProgress: (id, data) => api.put(`/incidents/${id}/progress`, data),
  getHint: (attemptId, stepIndex) => api.post(`/incidents/${attemptId}/hint`, { stepIndex }),
  completeIncident: (id, data) => api.put(`/incidents/${id}/complete`, data),
  getWiresharkData: (params) => api.get('/tools/wireshark', { params }),
  getSuricataAlerts: (params) => api.get('/tools/suricata', { params }),
  getSyslogData: (params) => api.get('/tools/syslog', { params }),
  startPacketCapture: () => api.post('/tools/wireshark/capture/start'),
  stopPacketCapture: () => api.post('/tools/wireshark/capture/stop'),
  getLeaderboard: (params) => api.get('/scores/leaderboard', { params }),
  getUserStats: () => api.get('/scores/user'),
  getAchievements: () => api.get('/scores/achievements'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users'),
};
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};
export const scenarioService = {
  getAll: (params) => api.get('/scenarios', { params }),
  getById: (id) => api.get(`/scenarios/${id}`),
  getHints: (id, step) => api.get(`/scenarios/${id}/hints`, { params: { step } }),
};
export const incidentService = {
  start: (scenarioId) => api.post('/incidents', { scenarioId }),
  getAll: (params) => api.get('/incidents', { params }),
  getById: (id) => api.get(`/incidents/${id}`),
  updateStep: (id, data) => api.put(`/incidents/${id}/step`, data),
  useHint: (id) => api.post(`/incidents/${id}/hint`),
};
export const toolsService = {
  getWiresharkData: (params) => api.get('/tools/wireshark', { params }),
  getSuricataAlerts: (params) => api.get('/tools/suricata', { params }),
  getSyslogData: (params) => api.get('/tools/syslog', { params }),
};
export const scoresService = {
  getLeaderboard: (params) => api.get('/scores/leaderboard', { params }),
  getUserScores: () => api.get('/scores/user'),
};
export const userService = {
  getProfile: () => api.get('/users/profile'),
  getAllUsers: () => api.get('/users'),
};
export default api;