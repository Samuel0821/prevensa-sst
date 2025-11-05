
// app-mobile/app/(user)/users.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';

// Componente para mostrar un campo de información del perfil
const InfoRow = ({ label, value, icon }) => (
  <View style={styles.infoRow}>
    <FontAwesome5 name={icon} size={20} color="#555" style={styles.icon} />
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

export default function UserProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar tu sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Cerrar Sesión",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>No se pudo cargar la información del usuario.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name ? user.name[0].toUpperCase() : 'U'}</Text>
        </View>
        <Text style={styles.name}>{user.name || 'Usuario'}</Text>
        <Text style={styles.company}>{user.company_name || 'Empresa sin asignar'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información de la Cuenta</Text>
        <InfoRow label="Correo Electrónico" value={user.email} icon="envelope" />
        <InfoRow label="Rol de Usuario" value={user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'} icon="user-tag" />
        <InfoRow label="Empresa" value={user.company_name || 'Sin asignar'} icon="building" />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesome5 name="sign-out-alt" size={20} color="#D32F2F" />
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  company: {
    fontSize: 16,
    color: '#6C6C6E',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    textAlign: 'center',
    marginRight: 15,
  },
  label: {
    color: '#6C6C6E',
    fontSize: 14,
    marginBottom: 2,
  },
  value: {
    color: '#1C1C1E',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 10,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  logoutButtonText: {
    color: '#D32F2F',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
});
