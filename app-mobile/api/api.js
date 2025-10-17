
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Interceptor para añadir el token a las cabeceras de las solicitudes protegidas
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth --- //
export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const getProfile = () => {
  return api.get('/auth/profile');
};


// --- Dashboard (Admin) --- //
export const getDashboardStats = () => {
  return api.get('/dashboard');
};

// --- Users (Admin) --- //
export const getUsers = () => {
  return api.get('/users');
};

// --- Incidents --- //
export const getIncidents = () => {
  return api.get('/incidents');
};

export const createIncident = (incidentData) => {
  return api.post('/incidents', incidentData);
};

// --- Trainings --- //
export const getTrainings = () => {
  return api.get('/trainings');
};

// --- Documents --- //
export const getDocuments = () => {
  return api.get('/documents');
};


export default api;
