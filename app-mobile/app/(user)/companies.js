
// app-mobile/app/(user)/companies.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '../../api/api';
import { FontAwesome5 } from '@expo/vector-icons';

export default function UserCompaniesScreen() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Carga todas las empresas desde el backend
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

  // Carga los datos cuando la pantalla se enfoca
  useFocusEffect(useCallback(() => { 
    setLoading(true);
    fetchCompanies(); 
  }, []));

  // Lógica para el "pull-to-refresh"
  const onRefresh = useCallback(() => { 
    setIsRefreshing(true);
    fetchCompanies(); 
  }, []);

  if (loading && !isRefreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF"/>
        <Text>Cargando empresas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Empresas Registradas</Text>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={["#007AFF"]}/>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <FontAwesome5 name="building" size={24} color="#007AFF" style={styles.icon}/>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardInfo}>NIT: {item.nit}</Text>
                <Text style={styles.cardInfo}><FontAwesome5 name="map-marker-alt"/> {item.address}</Text>
                <Text style={styles.cardInfo}><FontAwesome5 name="phone"/> {item.phone}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<View style={styles.centered}><Text style={styles.emptyText}>No hay empresas registradas.</Text></View>}
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
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
      marginRight: 15,
      width: 30,
      textAlign: 'center',
  },
  cardContent: {
      flex: 1,
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#333'
  },
  cardInfo: { 
    fontSize: 14, 
    color: '#555',
    marginTop: 5
  },
  emptyText: { 
    textAlign: 'center', 
    color: 'gray', 
    fontSize: 16 
  },
});
