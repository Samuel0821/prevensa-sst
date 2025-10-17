
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl, Linking, Alert } from 'react-native';
import { getDocuments } from '../../api/api';
import { Ionicons } from '@expo/vector-icons';

const DocumentCard = ({ item }) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(item.fileUrl);
    if (supported) {
      await Linking.openURL(item.fileUrl);
    } else {
      Alert.alert('Error', `No se puede abrir esta URL: ${item.fileUrl}`);
    }
  }, [item.fileUrl]);

  return (
    <View style={styles.card}>
      <Ionicons name="ios-document-text-outline" size={40} color="#007AFF" style={styles.cardIcon} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Ver Documento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDocuments = async () => {
    try {
      const response = await getDocuments();
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } 
  };

  useEffect(() => {
    fetchDocuments().finally(() => setLoading(false));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDocuments();
    setRefreshing(false);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.centered} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Documentos</Text>
      </View>

      {documents.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Ionicons name="ios-folder-open-outline" size={60} color="#CCC" />
            <Text style={styles.emptyText}>No hay documentos disponibles.</Text>
        </View>
      ) : (
        <FlatList
            data={documents}
            renderItem={({ item }) => <DocumentCard item={item} />}
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
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  button: { backgroundColor: '#007AFF', paddingVertical: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555', marginTop: 10 },
});
