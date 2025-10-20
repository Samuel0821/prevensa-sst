
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as api from '../../api/api.js';
import { FontAwesome5 } from '@expo/vector-icons';


// --- Componente de Tarjeta de Estadísticas ---
const StatCard = ({ title, value, icon, color }) => (
  <View style={styles.statCard}>
    <FontAwesome5 name={icon} size={24} color={color} style={styles.statIcon} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

// --- Pantalla del Dashboard ---
export default function DashboardScreen() {
  const [stats, setStats] = useState({ incidents: 0, trainings: 0, documents: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const [incidentsRes, trainingsRes, documentsRes, usersRes] = await Promise.all([
        api.get('/incidents'),
        api.get('/trainings'),
        api.get('/documents'),
        api.get('/users')
      ]);
      setStats({
        incidents: incidentsRes.data.length || 0,
        trainings: trainingsRes.data.length || 0,
        documents: documentsRes.data.length || 0,
        users: usersRes.data.length || 0
      });
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las estadísticas.");
      console.error("Error fetching stats:", error);
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
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Resumen General</Text>
      <View style={styles.statsContainer}>
        <StatCard title="Incidentes" value={stats.incidents} icon="exclamation-triangle" color="#FF3B30" />
        <StatCard title="Capacitaciones" value={stats.trainings} icon="chalkboard-teacher" color="#007AFF" />
        <StatCard title="Documentos" value={stats.documents} icon="file-alt" color="#34C759" />
        <StatCard title="Usuarios" value={stats.users} icon="users" color="#FF9500" />
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.quickActionsTitle}>Accesos Rápidos</Text>
         {/* Los accesos rápidos se mantienen, pero la funcionalidad de crear es manejada por cada pantalla */}
        <TouchableOpacity style={styles.actionButton} onPress={() => {/* Navegar a Incidentes */}}>
          <FontAwesome5 name="exclamation-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Ver Incidentes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => {/* Navegar a Capacitaciones */}}>
          <FontAwesome5 name="plus-circle" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Agendar Capacitación</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', paddingHorizontal: 20, paddingTop: 20, paddingBottom:10, backgroundColor: 'white' },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 10, backgroundColor:'white' },
  statCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 8, 
    padding: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '45%', 
    marginBottom: 15, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statIcon: { marginBottom: 10 },
  statValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  statTitle: { fontSize: 14, color: '#666' },
  quickActions: { marginTop: 20, paddingHorizontal: 20 },
  quickActionsTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  actionButton: { 
    backgroundColor: '#007AFF', 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 10 
  },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});
