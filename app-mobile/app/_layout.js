
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { initializeNotificationService } from '../src/services/notificationService'; // 1. Importar el servicio

// Componente inicial que decide qué mostrar
const InitialLayout = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inApp = segments[0] === '(user)' || segments[0] === '(admin)';

    if (user && !inApp) {
      // 2. Si el usuario está autenticado, iniciar el servicio de notificaciones
      initializeNotificationService();

      const targetRoute = user.role === 'admin' ? '/(admin)/dashboard' : '/(user)/dashboard';
      router.replace(targetRoute);
    } else if (!user && inApp) {
      router.replace('/');
    }
  }, [user, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <Slot />;
};

// Layout principal que envuelve toda la aplicación
export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
