
// frontend-web/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- CORRECCIÓN DEFINITIVA: RESTAURACIÓN DE SESIÓN ---
  // Este efecto ahora restaura TODA la sesión del usuario desde el localStorage,
  // no solo el hecho de que está autenticado.
  useEffect(() => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        // Se restaura el objeto de usuario, lo que permite que otros contextos
        // que dependen de 'user' funcionen correctamente.
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Si hay un error (ej. JSON malformado), se limpia todo.
      console.error("Error al restaurar la sesión:", error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      // Se guarda tanto el token como el objeto de usuario en localStorage.
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData)); // Guardar como string
      
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error en el login:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    // Se limpia el almacenamiento local completo de la sesión.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    // Redirigir a login para asegurar un estado limpio.
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
