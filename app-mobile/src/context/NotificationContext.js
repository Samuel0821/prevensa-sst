
// app-mobile/src/context/NotificationContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    // Listener para notificaciones recibidas mientras la app está abierta
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setHasUnreadNotifications(true);
    });

    // Listener para cuando el usuario toca una notificación
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      setHasUnreadNotifications(false);
      // Aquí puedes agregar navegación a la pantalla de notificaciones si lo deseas
    });

    // Limpiar listeners al desmontar
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const value = {
    hasUnreadNotifications,
    setHasUnreadNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
