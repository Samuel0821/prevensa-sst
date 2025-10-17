
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { getTrainings } from '../../api/api';
import { Ionicons } from '@expo/vector-icons';

const TrainingCard = ({ item }) => (
  <View style={styles.card}>
    <Ionicons name="ios-school-outline" size={40} color="#007AFF" style={styles.cardIcon} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </View>
  </View>
);

export default function TrainingsScreen() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrainings = async () => {
    try {
      const response = await getTrainings();
      setTrainings(response.data);
    } catch (error) {
      console.error("Error fetching trainings:", error);
    } 
  };

  useEffect(() => {
    fetchTrainings().finally(() => setLoading(false));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTrainings();
    setRefreshing(false);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.centered} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Capacitaciones</Text>
      </View>

      {trainings.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Ionicons name="ios-school" size={60} color="#CCC" />
            <Text style={styles.emptyText}>No hay capacitaciones disponibles.</Text>
        </View>
      ) : (
        <FlatList
            data={trainings}
            renderItem={({ item }) => <TrainingCard item={item} />}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007AFF']} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F7' },
  header: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
  title: { fontSize: 28, fontWeight: 'bold' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 10 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8, padding: 20, marginVertical: 5, marginHorizontal: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3 },
  cardIcon: { marginRight: 20 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardDescription: { fontSize: 14, color: '#555' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555', marginTop: 10 },
});
