
// app-mobile/app/_layout.js
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Este componente es el "guardián" de las rutas.
// Su única responsabilidad es redirigir al usuario basándose en su estado de autenticación.
const InitialLayout = () => {
  const { user, isLoading } = useAuth(); // Obtiene el usuario y el estado de carga del contexto.
  const segments = useSegments(); // Obtiene los segmentos de la ruta actual (ej: ['(admin)', 'dashboard'])
  const router = useRouter();

  useEffect(() => {
    // Si aún estamos comprobando si hay un usuario en AsyncStorage, no hacemos nada.
    if (isLoading) return;

    // Comprueba si el usuario está en una de las secciones protegidas de la app.
    const inApp = segments[0] === '(admin)' || segments[0] === '(user)';

    // Caso 1: El usuario está autenticado (`user` existe) pero NO está en una sección protegida.
    // Esto significa que está en la pantalla de login, pero ya tiene una sesión activa.
    // Lo redirigimos al dashboard que le corresponde.
    if (user && !inApp) {
      const targetRoute = user.role === 'admin' ? '/(admin)/dashboard' : '/(user)/dashboard';
      router.replace(targetRoute);
    }
    // Caso 2: El usuario NO está autenticado y está intentando acceder a una sección protegida.
    // Esto puede pasar si cierra sesión o su token expira. Lo enviamos al login.
    else if (!user && inApp) {
      router.replace('/');
    }
  }, [user, isLoading, segments, router]); // Se ejecuta cada vez que cambia el usuario, el estado de carga o la ruta.

  // Mientras se carga el estado de autenticación, mostramos un indicador de carga.
  // Esto evita parpadeos o que se muestre la pantalla de login por un instante.
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Si no se está cargando, muestra la pantalla que corresponda (Login o el Dashboard).
  return <Slot />;
};

// El layout principal que envuelve toda la aplicación.
export default function RootLayout() {
  return (
    // El AuthProvider pone el contexto de autenticación a disposición de toda la app.
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
