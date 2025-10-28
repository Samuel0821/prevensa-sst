// app-mobile/app/(user)/dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '../../api/api'; // RUTA CORREGIDA

// Componente reutilizable para las tarjetas de estadísticas
const StatCard = ({ title, value, color, icon }) => (
  <View style={[styles.card, { borderTopColor: color }]}>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
);

// Componente reutilizable para las tarjetas de progreso
const ProgressCard = ({ title, percentage, color }) => (
  <View style={[styles.progressCard, { backgroundColor: color }]}>
    <Text style={styles.progressTitle}>{title}</Text>
    <Text style={styles.progressPercentage}>{percentage}%</Text>
  </View>
);

export default function DashboardScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // useFocusEffect se ejecuta cada vez que la pantalla entra en foco
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchStats();
    }, [])
  );

  // Función para manejar el "pull-to-refresh"
  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Cargando panel...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Panel de Control</Text>

      {stats ? (
        <View>
          <View style={styles.cardRow}>
            <StatCard title="Empresas" value={stats.totalCompanies} color="#007AFF" />
            <StatCard title="Incidentes" value={stats.totalIncidents} color="#FF3B30" />
          </View>
          <View style={styles.cardRow}>
            <StatCard title="Capacitaciones" value={stats.totalTrainings} color="#FF9500" />
            <StatCard title="Documentos" value={stats.totalDocuments} color="#34C759" />
          </View>
          
          <View style={styles.progressRow}>
             <ProgressCard title="Incidentes Cerrados" percentage={stats.incidentsClosedPercentage} color="#5856D6" />
          </View>
          <View style={styles.progressRow}>
            <ProgressCard title="Capacitaciones Completadas" percentage={stats.trainingsCompletedPercentage} color="#00C7BE" />
          </View>
        </View>
      ) : (
        <View style={styles.centered}>
            <Text style={styles.errorText}>No se pudieron cargar las estadísticas. Desliza hacia abajo para reintentar.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1C1C1E',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
   progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
    borderTopWidth: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: '#6C6C6E',
    marginTop: 8,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  progressCard: {
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  progressTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressPercentage: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 5,
  },
  errorText: {
      fontSize: 16,
      color: '#8A8A8E',
      textAlign: 'center'
  }
});
