
// app-mobile/src/services/notificationService.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { api } from '../../api/api';
import { router } from 'expo-router';

// --- Configuración del manejador de notificaciones ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// --- Función principal de inicialización ---
export const initializeNotificationService = async () => {
  try {
    await requestPermissions();
    const token = await getPushToken();

    if (token) {
      console.log('Token de notificación obtenido:', token);
      await sendTokenToBackend(token);
    }

    // --- Listeners para gestionar las interacciones ---
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida en primer plano:', notification);
      // Aquí se podría actualizar el estado de notificaciones no leídas
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('El usuario ha interactuado con la notificación:', response);
      handleNotificationRedirection(response.notification);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };

  } catch (error) {
    console.error("Error al inicializar el servicio de notificaciones:", error);
  }
};

// --- Función para manejar la redirección ---
const handleNotificationRedirection = (notification) => {
  const { data } = notification.request.content;
  console.log("Datos recibidos en la notificación:", data);

  if (data) {
    switch (data.type) {
      case 'new_incident':
        if (data.incidentId) {
          console.log(`Redirigiendo al incidente con ID: ${data.incidentId}`);
          router.push(`/(admin)/incidents`);
        }
        break;
      case 'new_training':
        console.log('Redirigiendo a la pantalla de capacitaciones');
        router.push('/(user)/trainings');
        break;
      default:
        console.log('Tipo de notificación no reconocido:', data.type);
    }
  }
};

// --- Funciones auxiliares ---
const requestPermissions = async () => {
  if (!Device.isDevice) {
    console.warn('Las notificaciones push solo funcionan en dispositivos físicos.');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('El usuario no ha concedido los permisos de notificación.');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
};

const getPushToken = async () => {
  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
  } catch (error) {
    console.error("Error al obtener el token de notificación:", error);
    return null;
  }
};

const sendTokenToBackend = async (fcmToken) => {
  try {
    await api.post('/users/update-fcm-token', { fcmToken });
    console.log('Token de notificación enviado al backend con éxito.');
  } catch (error) {
    console.error("Error al enviar el token al backend:", error.response?.data || error.message);
  }
};
