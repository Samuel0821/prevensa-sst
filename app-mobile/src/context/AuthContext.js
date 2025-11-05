
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// CORREGIDO: La ruta a la API es de dos niveles hacia arriba.
import api from '../../api/api'; 

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user'); 
        const storedRole = await AsyncStorage.getItem('userRole');

        if (storedToken && storedUser) {
          // Primero, configurar el header de la API para las siguientes peticiones.
          api.defaults.headers.Authorization = `Bearer ${storedToken}`;
          // Luego, actualizar el estado de la aplicación.
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setUserRole(storedRole);
        }
      } catch (error) {
        console.error("Error cargando datos de AsyncStorage", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Primero, configurar el header para las futuras peticiones de esta sesión.
      api.defaults.headers.Authorization = `Bearer ${token}`;
      // Luego, guardar los datos en el almacenamiento para persistir la sesión.
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user)); 
      await AsyncStorage.setItem('userRole', user.role);

      // Finalmente, actualizar el estado global de la aplicación.
      setToken(token);
      setUser(user);
      setUserRole(user.role);
      
      return { success: true, user };
    } catch (error) {
      console.error("Error en el login:", error.response?.data?.message || error.message);
      return { success: false, message: error.response?.data?.message || 'Error de red' };
    }
  };

  const logout = async () => {
    try {
      // Limpiar el header de autorización.
      delete api.defaults.headers.Authorization;
      // Eliminar los datos de la sesión del almacenamiento.
      await AsyncStorage.multiRemove(['token', 'user', 'userRole']);
      // Resetear el estado de la aplicación.
      setUser(null);
      setToken(null);
      setUserRole(null);
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

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthContext };