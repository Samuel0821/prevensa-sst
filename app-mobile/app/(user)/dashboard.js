// app-mobile/app/(user)/dashboard.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '../../api/api'; // CORRECCIÓN: Importación por defecto
import { FontAwesome5 } from '@expo/vector-icons';

const StatCard = ({ icon, label, value, color }) => (
  <View style={styles.card}>
    <FontAwesome5 name={icon} size={24} color={color} />
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardLabel}>{label}</Text>
  </View>
);

export default function UserDashboard() {
  const [stats, setStats] = useState({ incidents: 0, trainings: 0, documents: 0 });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats/dashboard');
      setStats(response.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las estadísticas.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchStats(); }, []));
  const onRefresh = useCallback(() => { setIsRefreshing(true); fetchStats(); }, []);

  if (loading && !isRefreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Panel de Usuario</Text>
      <View style={styles.statsContainer}>
        <StatCard icon="exclamation-triangle" label="Incidentes Reportados" value={stats.incidents} color="#FF9500" />
        <StatCard icon="chalkboard-teacher" label="Capacitaciones Asignadas" value={stats.trainings} color="#007AFF" />
        <StatCard icon="file-alt" label="Documentos Disponibles" value={stats.documents} color="#34C759" />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>¡Bienvenido!</Text>
        <Text style={styles.infoText}>
          Aquí puedes ver un resumen de tu actividad. Reporta incidentes para mejorar la seguridad y mantente al día con tus capacitaciones.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: '#F0F2F5',
    padding: 15,
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: '#1C1C1E'
  },
  statsContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    flexWrap: 'wrap'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    minWidth: 150,
    margin: 5,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#1C1C1E'
  },
  cardLabel: {
    fontSize: 14,
    color: '#6C6C6E',
    textAlign: 'center'
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 2
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333'
  }
});
