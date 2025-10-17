
import { AuthProvider, useAuth } from '../src/context/AuthContext'; // Ruta corregida
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Componente inicial que decide qué mostrar
const InitialLayout = () => {
  const { user, isLoading } = useAuth(); // Corregido: usa isLoading
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // No hacer nada hasta que la carga inicial de autenticación haya terminado
    if (isLoading) return;

    const inApp = segments[0] === '(user)' || segments[0] === '(admin)';

    if (user && !inApp) {
      // Si el usuario está autenticado, redirigir según su rol
      const targetRoute = user.role === 'admin' ? '/(admin)/dashboard' : '/(user)/incidents';
      router.replace(targetRoute);
    } else if (!user && inApp) {
      // Si no hay usuario y se intenta acceder a una ruta protegida, redirigir al login
      router.replace('/');
    }
  }, [user, isLoading, segments, router]);

  // Mientras carga la autenticación, muestra un indicador de actividad.
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Si la carga ha terminado, muestra la pantalla actual.
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
