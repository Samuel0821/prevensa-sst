
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, RefreshControl
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as api from '../../api/api';

// --- Pantalla de Usuarios para Rol de Usuario (Solo Vista) ---

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Función para obtener los datos de los usuarios desde la API
  const fetchData = async () => {
    try {
      const usersRes = await api.get('/users');
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      Alert.alert("Error", "No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Hooks para cargar datos y refrescar la lista
  useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, []));
  const onRefresh = useCallback(() => { setIsRefreshing(true); fetchData(); }, []);

  // Indicador de carga inicial
  if (loading && !isRefreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Usuarios del Sistema</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text>{item.email}</Text>
                {/* Badge para mostrar el rol del usuario */}
                <View style={[styles.badge, item.role === 'admin' ? styles.badgeAdmin : styles.badgeUser]}>
                    <Text style={styles.badgeText}>{item.role}</Text>
                </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay usuarios registrados.</Text>}
      />
      {/* No hay botón flotante (FAB) para añadir usuarios */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', padding: 20, backgroundColor: 'white' },
  card: { 
    backgroundColor: 'white', 
    marginVertical: 8, 
    marginHorizontal:12, 
    borderRadius: 8, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardContent: { 
    padding: 15 
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 2 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    color: 'gray', 
    fontSize: 16 
  },
  badge: { 
    borderRadius: 12, 
    paddingVertical: 4, 
    paddingHorizontal: 10, 
    alignSelf: 'flex-start', 
    marginTop: 10 
  },
  badgeAdmin: { 
    backgroundColor: '#007AFF' 
  },
  badgeUser: { 
    backgroundColor: '#34C759' 
  },
  badgeText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 12 
  },
});

