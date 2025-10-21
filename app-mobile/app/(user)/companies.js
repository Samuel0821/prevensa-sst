
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as api from '../../api/api';

export default function CompaniesScreen() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Función para cargar las empresas desde la API
  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error("Error al cargar empresas:", error);
      Alert.alert("Error", "No se pudieron cargar las empresas.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Hooks para cargar datos al entrar en la pantalla y para el gesto de "refrescar"
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
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.cardSubtitle}>NIT: {item.nit}</Text>
                        <Text style={styles.cardInfo}>{item.address}</Text>
                        <Text style={styles.cardInfo}>{item.phone}</Text>
                    </View>
                    {/* No hay botones de acción para el rol de usuario */}
                </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No hay empresas registradas.</Text>}
        />
      {/* No hay botón flotante (FAB) para el rol de usuario */}
    </View>
  );
}

// Estilos unificados para mantener la consistencia visual
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', padding: 20, backgroundColor: 'white' },
  card: { 
      backgroundColor: 'white', 
      marginVertical: 8, 
      marginHorizontal: 16, 
      borderRadius: 8, 
      elevation: 3, 
      padding: 16 
    },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: 'gray', marginBottom: 8 },
  cardInfo: { fontSize: 14, color: '#333', marginBottom: 2 },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
});
