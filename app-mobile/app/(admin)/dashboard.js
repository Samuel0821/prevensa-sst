
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { getDashboardStats } from '../../api/api'; 

// Componente para cada tarjeta de estadística
const StatCard = ({ title, value, color }) => (
  <View style={[styles.card, { borderTopColor: color }]}>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
);

export default function Dashboard() {
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        setStats(response.data);
        setError(null);
      } catch (err) {
        setError("No se pudieron cargar las estadísticas. ¿Está el servidor backend en funcionamiento?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Button title="Cerrar Sesión" onPress={logout} color="#FF3B30" />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : stats ? (
        <View style={styles.statsContainer}>
          <StatCard title="Usuarios Registrados" value={stats.usersCount} color="#007AFF" />
          <StatCard title="Incidentes Reportados" value={stats.incidentsCount} color="#FF9500" />
          <StatCard title="Capacitaciones" value={stats.trainingsCount} color="#34C759" />
          <StatCard title="Documentos" value={stats.documentsCount} color="#5856D6" />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    borderTopWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    color: 'red',
    fontSize: 16,
    paddingHorizontal: 20,
  }
});
