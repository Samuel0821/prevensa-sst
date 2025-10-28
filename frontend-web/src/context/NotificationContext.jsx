// frontend-web/src/context/NotificationContext.jsx
import React, { createContext, useState, useCallback } from 'react';

// 1. Crear el Contexto
export const NotificationContext = createContext();

// 2. Crear el Proveedor del Contexto
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const addNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000); // La notificación desaparecerá después de 5 segundos
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// 3. Hook personalizado para usar el contexto más fácilmente
export const useNotification = () => {
  return React.useContext(NotificationContext);
};
