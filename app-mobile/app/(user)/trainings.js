// app-mobile/app/(user)/trainings.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '../../api/api'; // CORRECCIÓN: Importación por defecto
import { FontAwesome5 } from '@expo/vector-icons';

const StatusBadge = ({ status }) => {
    const statusInfo = {
      Pendiente: { color: '#FF9500', icon: 'hourglass-half' },
      Completada: { color: '#34C759', icon: 'check-circle' },
      Cancelada: { color: '#FF3B30', icon: 'times-circle' },
    };
  
    const { color, icon } = statusInfo[status] || { color: '#8E8E93', icon: 'question-circle' };
  
    return (
      <View style={[styles.statusBadge, { backgroundColor: color }]}>
        <FontAwesome5 name={icon} size={14} color="white" />
        <Text style={styles.statusBadgeText}>{status}</Text>
      </View>
    );
  };

// --- PANTALLA DE CAPACITACIONES (VISTA USUARIO) ---
export default function TrainingsScreen() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Carga las capacitaciones asignadas al usuario
  const fetchTrainings = async () => {
    try {
      const response = await api.get('/trainings/my-trainings');
      setTrainings(response.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las capacitaciones.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchTrainings(); }, []));
  const onRefresh = useCallback(() => { setIsRefreshing(true); fetchTrainings(); }, []);

  if (loading && !isRefreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Capacitaciones Asignadas</Text>
      <FlatList
        data={trainings}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.topic}</Text>
                <StatusBadge status={item.status} />
            </View>
            <Text style={styles.cardDescription}>{item.description || "Detalles de la capacitación."}</Text>
            <View style={styles.separator}/>
            <Text style={styles.cardInfo}><FontAwesome5 name="building"/> {item.company_name || 'N/A'}</Text>
            <Text style={styles.cardInfo}><FontAwesome5 name="chalkboard-teacher"/> {item.trainer}</Text>
            <Text style={styles.cardInfo}><FontAwesome5 name="calendar-alt"/> {new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.cardInfo}><FontAwesome5 name="users"/> {item.participants} Asistentes</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No tienes capacitaciones asignadas.</Text>}
      />
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
        marginHorizontal: 12, 
        borderRadius: 8, 
        elevation: 3, 
        paddingVertical: 15 
    },
    cardHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 15, 
        paddingBottom: 5 
    },
    cardTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        flex: 1, 
        marginRight: 10 
    },
    cardDescription: { 
        fontSize: 14, 
        color: '#666', 
        paddingHorizontal: 15, 
        paddingTop: 5, 
        paddingBottom: 10 
    },
    separator: { 
        height: 1, 
        backgroundColor: '#eee', 
        marginHorizontal: 15, 
        marginBottom: 10 
    },
    cardInfo: { 
        fontSize: 14, 
        color: '#333', 
        paddingHorizontal: 15, 
        marginBottom: 6 
    },
    emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
    statusBadge: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 5, 
        paddingHorizontal: 10, 
        borderRadius: 15 
    },
    statusBadgeText: { 
        color: 'white', 
        fontWeight: 'bold', 
        marginLeft: 5 
    },
  });
