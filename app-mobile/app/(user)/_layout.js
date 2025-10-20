
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../../src/context/AuthContext'; 
import { FontAwesome5 } from '@expo/vector-icons';

// Definición del componente de la cabecera directamente en el layout
const AppHeader = () => {
  const { user, company, logout } = useAuth();

  if (!user) {
    return <View style={styles.headerContainer} />;
  }

  return (
    <View style={styles.headerContainer}>
        <View style={styles.userInfo}>
            <FontAwesome5 name="user-circle" size={24} color="white" />
            <View style={styles.userTextContainer}>
                <Text style={styles.userName}>{user.name || 'Usuario'}</Text>
                <Text style={styles.userRole}>{user.role === 'admin' ? 'Administrador' : 'Usuario'}</Text>
            </View>
        </View>
        <View style={styles.companyInfo}>
            <FontAwesome5 name="building" size={14} color="#E0E0E0" />
            <Text style={styles.companyName}>{company?.name || 'Sin Empresa'}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <FontAwesome5 name="sign-out-alt" size={24} color="white" />
        </TouchableOpacity>
    </View>
  );
};

export default function UserLayout() {
  return (
    <Tabs 
      screenOptions={({ route }) => ({
        header: () => <AppHeader />,
        headerShown: true, 
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'dashboard') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'incidents') {
            iconName = focused ? 'ios-alert-circle' : 'ios-alert-circle-outline';
          } else if (route.name === 'trainings') {
            iconName = focused ? 'ios-school' : 'ios-school-outline';
          } else if (route.name === 'documents') {
            iconName = focused ? 'ios-document-text' : 'ios-document-text-outline';
          } else if (route.name === 'companies' || route.name === 'users') {
            iconName = focused ? 'ios-business' : 'ios-business-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="incidents" options={{ title: 'Incidentes' }} />
      <Tabs.Screen name="trainings" options={{ title: 'Capacitaciones' }} />
      <Tabs.Screen name="documents" options={{ title: 'Documentos' }} />
      <Tabs.Screen name="companies" options={{ title: 'Empresas' }} />
      <Tabs.Screen name="users" options={{ title: 'Usuario' }} /> 
    </Tabs>
  );
}

// Estilos para el componente de la cabecera
const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#007AFF',
        paddingTop: Platform.OS === 'android' ? 45 : 55,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userTextContainer: {
        marginLeft: 12,
    },
    userName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    userRole: {
        color: '#E0E0E0',
        fontSize: 14,
    },
    companyInfo: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        right: 0,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    companyName: {
        color: '#E0E0E0',
        fontSize: 12,
        marginLeft: 5,
    },
    logoutButton: {
        padding: 5,
    },
});
