
// app-mobile/app/(user)/dashboard.js
// ESTE ARCHIVO ES UN ESPEJO DEL DASHBOARD DEL ADMINISTRADOR

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '../../api/api';
import { FontAwesome5 } from '@expo/vector-icons';

const StatCard = ({ title, value, icon, color }) => (
  <View style={[styles.card, { borderTopColor: color }]}>
    <FontAwesome5 name={icon} size={24} color={color} style={styles.cardIcon} />
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
);

const ProgressCard = ({ title, percentage, color }) => (
    <View style={styles.progressCardContainer}>
        <Text style={styles.progressTitle}>{title}</Text>
        <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
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
      Alert.alert("Error de Carga", "No se pudieron obtener las estadísticas. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchStats();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, []);

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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#007AFF"]}/>}
    >
      {/* Título ajustado para ser neutral */}
      <Text style={styles.header}>Panel de Control</Text>
      {stats ? (
        <View>
          <View style={styles.cardRow}>
            <StatCard title="Empresas" value={stats.totalCompanies} icon="building" color="#007AFF" />
            <StatCard title="Usuarios" value={stats.totalUsers} icon="users" color="#34C759" />
          </View>
          <View style={styles.cardRow}>
            <StatCard title="Documentos" value={stats.totalDocuments} icon="file-alt" color="#16A34A" /> 
            <StatCard title="Incidentes" value={stats.totalIncidents} icon="exclamation-triangle" color="#FF3B30" />
          </View>
          <View style={styles.cardRow}>
            <StatCard title="Capacitaciones" value={stats.totalTrainings} icon="chalkboard-teacher" color="#FF9500" />
          </View>
          
          <View style={styles.progressSection}>
            <ProgressCard title="Incidentes Cerrados" percentage={stats.incidentsClosedPercentage} color="#5856D6" />
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
    paddingHorizontal: 10,
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
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopWidth: 5,
  },
  cardIcon: {
      marginBottom: 10,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  cardTitle: {
    fontSize: 14,
    color: '#6C6C6E',
    marginTop: 5,
    fontWeight: '500',
  },
  progressSection: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 20,
      marginHorizontal: 8,
      marginTop: 10,
      marginBottom: 20,
      elevation: 4,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 10
  },
  progressCardContainer: {
      marginVertical: 12,
  },
  progressTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#3C3C43',
      marginBottom: 8,
  },
  progressBarBackground: {
      height: 12,
      backgroundColor: '#E5E5EA',
      borderRadius: 6,
      overflow: 'hidden',
  },
  progressBarFill: {
      height: '100%',
      borderRadius: 6,
  },
  progressPercentage: {
      textAlign: 'right',
      fontSize: 14,
      fontWeight: '700',
      color: '#6C6C6E',
      marginTop: 4
  },
  errorText: {
      fontSize: 16,
      color: '#8A8A8E',
      textAlign: 'center'
  }
});
