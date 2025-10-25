import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Alert, ActivityIndicator, RefreshControl
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '../../api/api';

// --- PANTALLA DE PERFIL DE USUARIO ---
export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Carga el perfil del usuario desde la API
  const fetchData = async () => {
    try {
      // Llama a la nueva ruta segura que devuelve solo los datos del usuario logueado
      const profileRes = await api.get('/auth/profile');
      setProfile(profileRes.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo cargar tu perfil.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Hooks para cargar y refrescar datos
  useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, []));
  const onRefresh = useCallback(() => { setIsRefreshing(true); fetchData(); }, []);

  // Indicador de carga inicial
  if (loading && !isRefreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  // --- RENDERIZADO DEL PERFIL ---
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mi Perfil</Text>
      <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}>
        {profile ? (
          <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{profile.name}</Text>
                <Text>{profile.email}</Text>
                <View style={[styles.badge, profile.role === 'admin' ? styles.badgeAdmin : styles.badgeUser]}>
                    <Text style={styles.badgeText}>{profile.role}</Text>
                </View>
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>No se pudo cargar la información del perfil.</Text>
        )}
      </RefreshControl>
    </View>
  );
}

// --- ESTILOS (UNIFICADOS CON EL RESTO DE LA APP) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', padding: 20, backgroundColor: 'white' },
  card: { backgroundColor: 'white', marginVertical: 20, marginHorizontal: 15, borderRadius: 8, elevation: 3 },
  cardContent: { padding: 20 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
  badge: { borderRadius: 12, paddingVertical: 5, paddingHorizontal: 12, alignSelf: 'flex-start', marginTop: 15 },
  badgeAdmin: { backgroundColor: '#007AFF' },
  badgeUser: { backgroundColor: '#34C759' },
  badgeText: { color: 'white', fontWeight: 'bold', fontSize: 14, textTransform: 'capitalize' },
});