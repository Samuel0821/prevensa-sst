
// app-mobile/app/(user)/_layout.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Tabs, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext'; // Importar el hook de autenticación
import NotificationIcon from '../../components/common/NotificationIcon'; // Importar el ícono de notificación
import { NotificationProvider } from '../../src/context/NotificationContext'; // Importar el provider

// Componente de cabecera
const CustomHeader = () => {
  const { user, logout } = useAuth(); // Obtener datos del usuario y función de logout

  const handleLogout = async () => {
    await logout();
    router.replace('/'); // Redirigir al login después de cerrar sesión
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/Logo_Prevensap.jpg')} style={styles.logo} />
        <Text style={styles.logoText}>PREVENSAP</Text>
      </View>
      <View style={styles.rightHeaderContainer}>
        <NotificationIcon />
        <View style={styles.userInfoContainer}>
          <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
              <Text style={styles.userRole}>{user?.role || 'Rol'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function UserLayout() {
  return (
    <NotificationProvider>
      <View style={{ flex: 1 }}>
        <CustomHeader />
        <Tabs screenOptions={({ route }) => ({
          headerShown: false, // La cabecera por defecto de las pestañas se oculta
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'dashboard') iconName = 'tachometer-alt';
            else if (route.name === 'companies') iconName = 'building';
            else if (route.name === 'incidents') iconName = 'exclamation-triangle';
            else if (route.name === 'trainings') iconName = 'chalkboard-teacher';
            else if (route.name === 'documents') iconName = 'file-alt';
            // --- Icono actualizado para el perfil ---
            else if (route.name === 'users') iconName = 'user-alt';
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          },
        })}>
          <Tabs.Screen name="dashboard" options={{ title: 'Panel' }} />
          <Tabs.Screen name="companies" options={{ title: 'Empresas' }} />
          <Tabs.Screen name="incidents" options={{ title: 'Incidentes' }} />
          <Tabs.Screen name="trainings" options={{ title: 'Formación' }} />
          <Tabs.Screen name="documents" options={{ title: 'Docs' }} />
          {/* --- Título de la pestaña actualizado --- */}
          <Tabs.Screen name="users" options={{ title: 'Mi Perfil' }} />
        </Tabs>
      </View>
    </NotificationProvider>
  );
}

// Estilos para la cabecera (actualizados)
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0052cc', 
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 40, 
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginRight: 10,
  },
  logoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15, // Espacio entre el ícono y la info del usuario
  },
  userName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  userRole: {
    color: '#E0E0E0',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  logoutButton: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 15,
  },
  logoutButtonText: {
    color: '#0052cc',
    fontWeight: 'bold',
  },
});
