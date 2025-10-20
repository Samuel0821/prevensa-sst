import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- IP ACTUALIZADA PARA LA RED MÓVIL ---
const API_URL = 'http://10.253.13.232:4000/api'; // Cambiado a la URL base correcta
export const ROOT_URL = API_URL; // Opcional: si necesitas la URL base en otro lugar

const instance = axios.create({
  baseURL: API_URL, // Usar la URL base correcta
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