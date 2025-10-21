import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- IP Y URLS CORREGIDAS ---
const BASE_URL = 'http://10.253.13.232:4000'; // URL raíz del servidor
const API_URL = `${BASE_URL}/api`;          // URL específica para la API
export const ROOT_URL = BASE_URL;           // Exportamos la URL raíz para los archivos

const instance = axios.create({
  baseURL: API_URL, // Axios usará la URL de la API
});

// Interceptor para inyectar el token en cada solicitud.
instance.interceptors.request.use(
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

export const get = instance.get;
export const post = instance.post;
export const put = instance.put;
export const remove = instance.delete;

export default instance;