// app-mobile/app/(user)/documents.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect, Link } from 'expo-router';
import api from '../../api/api'; // CORRECCIÓN: Importación por defecto
import { FontAwesome5 } from '@expo/vector-icons';

// --- PANTALLA DE DOCUMENTOS PARA EL USUARIO ---
export default function DocumentsScreen() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Carga los documentos desde la API
  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los documentos.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Carga los datos al entrar en la pantalla y permite refrescar
  useFocusEffect(useCallback(() => { setLoading(true); fetchDocuments(); }, []));
  const onRefresh = useCallback(() => { setIsRefreshing(true); fetchDocuments(); }, []);

  // Indicador de carga inicial
  if (loading && !isRefreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Documentos y Guías</Text>
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
        renderItem={({ item }) => {
          const hasUrl = typeof item.url === 'string' && item.url;
          const rootUrl = api.defaults.baseURL.replace('/api', '');
          const fullUrl = hasUrl ? `${rootUrl}/uploads/${item.url}` : '';

          return (
            <View style={styles.card}>
              <FontAwesome5 
                name={hasUrl && item.url.toLowerCase().includes('.pdf') ? 'file-pdf' : 'file-alt'} 
                size={30} 
                color={hasUrl && item.url.toLowerCase().includes('.pdf') ? '#D32F2F' : '#555'} 
                style={styles.icon}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}><FontAwesome5 name="building"/> {item.company_name}</Text>
              </View>
              {hasUrl ? (
                <Link href={fullUrl} asChild>
                  <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome5 name="download" size={20} color="#007AFF" />
                  </TouchableOpacity>
                </Link>
              ) : (
                <View style={[styles.actionButton, { opacity: 0.5 }]}>
                   <FontAwesome5 name="download" size={20} color="#ccc" />
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay documentos disponibles.</Text>}
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
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
  },
  icon: {
    marginRight: 15,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 13, color: 'gray', marginTop: 3 },
  actionButton: {
    padding: 10,
  },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
});
