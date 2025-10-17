
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getIncidents } from '../../api/api';
import { Ionicons } from '@expo/vector-icons';

const IncidentCard = ({ incident }) => {
  const statusColor = incident.status === 'PENDIENTE' ? '#FF9500' : '#34C759';
  const date = new Date(incident.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>{incident.description}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{incident.status}</Text>
        </View>
      </View>
      <Text style={styles.cardDate}>{`Reportado el ${date}`}</Text>
    </View>
  );
};

export default function IncidentsScreen() {
  const router = useRouter();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIncidents = async () => {
    try {
      const response = await getIncidents();
      setIncidents(response.data);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };

  // Cargar incidentes cuando la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchIncidents().finally(() => setLoading(false));
    }, [])
  );

  // Función para refrescar la lista manualmente (pull-to-refresh)
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchIncidents();
    setRefreshing(false);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.centered} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Incidentes</Text>
      </View>

      {incidents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="ios-information-circle-outline" size={60} color="#CCC" />
          <Text style={styles.emptyText}>No has reportado incidentes.</Text>
          <Text style={styles.emptySubText}>¡Usa el botón (+) para empezar!</Text>
        </View>
      ) : (
        <FlatList
          data={incidents}
          renderItem={({ item }) => <IncidentCard incident={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007AFF']} />}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(user)/create-incident')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F0F7' },
    header: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
    title: { fontSize: 28, fontWeight: 'bold' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 10 },
    card: { backgroundColor: '#FFF', borderRadius: 8, padding: 15, marginVertical: 5, marginHorizontal: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardTitle: { fontSize: 16, fontWeight: '500', flex: 1, marginRight: 10 },
    cardDate: { fontSize: 13, color: '#888', marginTop: 8 },
    statusBadge: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10 },
    statusText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
    fab: { position: 'absolute', right: 30, bottom: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowRadius: 5, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 } },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
    emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555', marginTop: 10 },
    emptySubText: { fontSize: 14, color: '#AAA', marginTop: 5 },
});
