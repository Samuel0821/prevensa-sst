import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api/api';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // CORREGIDO: Renombrado de 'loading' a 'isLoading'
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        const storedRole = await AsyncStorage.getItem('userRole');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setUserRole(storedRole);
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error("Error cargando datos de AsyncStorage", error);
      } finally {
        setIsLoading(false); // CORREGIDO: Usar el setter correcto
      }
    };

    loadStorageData();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('userRole', user.role);

      setToken(token);
      setUser(user);
      setUserRole(user.role);

      api.defaults.headers.Authorization = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      console.error("Error en el login:", error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Error de red' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user', 'userRole']);
      setUser(null);
      setToken(null);
      setUserRole(null);
      delete api.defaults.headers.Authorization;
    } catch (error) {
      console.error("Error en el logout", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, userRole, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// CORREGIDO: El hook 'useAuth' que faltaba por completo
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// CORREGIDO: Exportar el Provider y el hook para que puedan ser importados
export { AuthProvider, useAuth };
