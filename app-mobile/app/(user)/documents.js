
// app-mobile/app/(user)/documents.js
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import { useFocusEffect, Link } from 'expo-router';
import api from '../../api/api';
import { FontAwesome5 } from '@expo/vector-icons';

export default function UserDocumentsScreen() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Carga todos los documentos disponibles en el sistema
  const fetchData = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (error) {      
      Alert.alert("Error de Conexión", `No se pudieron cargar los documentos.`);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Vuelve a cargar los datos cuando la pantalla se enfoca
  useFocusEffect(useCallback(() => { 
    setLoading(true); 
    fetchData(); 
  }, []));

  // Lógica para el "pull-to-refresh"
  const onRefresh = useCallback(() => { 
    setIsRefreshing(true); 
    fetchData(); 
  }, []);

  if (loading && !isRefreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Cargando documentos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Repositorio de Documentos</Text>
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={["#007AFF"]}/>}
        renderItem={({ item }) => {
          const hasUrl = typeof item.url === 'string' && item.url;
          const rootUrl = api.defaults.baseURL.replace('/api', '');
          const fullUrl = hasUrl ? `${rootUrl}/uploads/${item.url}` : '';

          return (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                  <FontAwesome5 name={hasUrl && item.url.endsWith('.pdf') ? 'file-pdf' : 'file-alt'} size={24} style={styles.fileIcon} />
                  <View style={styles.contentWrapper}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardSubtitle}><FontAwesome5 name="building"/> {item.company_name}</Text>
                  </View>
                  
                  {hasUrl ? (
                    <Link href={fullUrl} style={styles.actionButton} asChild>
                      <TouchableOpacity>
                        <FontAwesome5 name="eye" size={20} color="#007AFF" />
                      </TouchableOpacity>
                    </Link>
                  ) : (
                    <View style={styles.actionButton}>
                      <FontAwesome5 name="eye-slash" size={20} color="#ccc" />
                    </View>
                  )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<View style={styles.centered}><Text style={styles.emptyText}>No hay documentos disponibles.</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: '#F0F2F5' 
    },
    centered: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 20 
    },
    header: { 
      fontSize: 26, 
      fontWeight: 'bold', 
      padding: 20, 
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd'
    },
    card: { 
      backgroundColor: 'white', 
      marginVertical: 8, 
      marginHorizontal: 12, 
      borderRadius: 10, 
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    cardContent: { 
      padding: 15, 
      flexDirection: 'row', 
      alignItems: 'center' 
    },
    contentWrapper: { 
      flex: 1 
    },
    fileIcon: { 
      marginRight: 15, 
      color: '#D32F2F'
    },
    cardTitle: { 
      fontSize: 16, 
      fontWeight: 'bold',
      color: '#333'
    },
    cardSubtitle: { 
      fontSize: 13, 
      color: '#555',
      marginTop: 4
    },
    actionButton: { 
      padding: 10, 
      marginLeft: 10
    },
    emptyText: { 
      textAlign: 'center', 
      marginTop: 50, 
      color: 'gray', 
      fontSize: 16 
    },
});
