// app-mobile/app/(user)/companies.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '../../api/api'; // CORRECCIÓN: Importación por defecto
import { FontAwesome5 } from '@expo/vector-icons';

// --- PANTALLA DE EMPRESAS PARA USUARIO (SOLO LECTURA) ---
export default function CompaniesScreen() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Carga las empresas desde la API
  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las empresas.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Hooks para cargar y refrescar datos
  useFocusEffect(useCallback(() => { setLoading(true); fetchCompanies(); }, []));
  const onRefresh = useCallback(() => { setIsRefreshing(true); fetchCompanies(); }, []);

  // Indicador de carga inicial
  if (loading && !isRefreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Empresas Asociadas</Text>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <FontAwesome5 name="building" size={24} color="#007AFF" style={styles.icon} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>NIT: {item.nit}</Text>
              <Text style={styles.cardInfo}>{item.address}</Text>
              <Text style={styles.cardInfo}>{item.phone}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay empresas disponibles.</Text>}
      />
    </View>
  );
}

// --- ESTILOS UNIFICADOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', padding: 20, backgroundColor: 'white' },
  card: { 
    backgroundColor: 'white', 
    marginVertical: 8, 
    marginHorizontal: 16, 
    borderRadius: 8, 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15,
    elevation: 2, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
  },
  icon: {
    marginRight: 15,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  cardSubtitle: { fontSize: 14, color: 'gray', marginBottom: 5 },
  cardInfo: { fontSize: 14, color: '#333' },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
});
