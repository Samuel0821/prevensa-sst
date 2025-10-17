
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../../api/api'; // RUTA DE IMPORTACIÓN CORREGIDA

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await api.getProfile();
          const userData = response.data;
          setUser(userData);
          setRole(userData.role);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          await AsyncStorage.setItem('userRole', userData.role);
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.log('Fallo la verificación de autenticación, limpiando almacenamiento.');
        setUser(null);
        setRole(null);
        await AsyncStorage.multiRemove(['token', 'user', 'userRole']);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);
      const { user: userData, token } = response.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('userRole', userData.role);
      setUser(userData);
      setRole(userData.role);
    } catch (error) {
      console.error('Error en la función de login del context:', error);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setUser(null);
      setRole(null);
      await AsyncStorage.multiRemove(['token', 'user', 'userRole']);
    } catch (e) {
      console.error("Error limpiando datos de autenticación:", e);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    role,
    isLoading: loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
