
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert,
  RefreshControl, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as api from '../../api/api.js';
import { FontAwesome5 } from '@expo/vector-icons';


const IncidentForm = ({ visible, onSave, onCancel, incident, setIncident, loading }) => (
  <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>{incident.id ? "Editar Incidente" : "Nuevo Incidente"}</Text>
      <TextInput
        placeholder="Descripción del incidente"
        style={[styles.input, { height: 100 }]} // Bigger text area
        value={incident.description}
        onChangeText={(text) => setIncident({ ...incident, description: text })}
        multiline
      />
      <View style={styles.buttonContainer}>
        <Button title="Guardar" onPress={onSave} disabled={loading} />
        <Button title="Cancelar" onPress={onCancel} color="#FF3B30" />
      </View>
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
    </View>
  </Modal>
);

export default function IncidentsScreen() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormState = { id: null, description: '' };
  const [formState, setFormState] = useState(initialFormState);

  const fetchData = async () => {
    try {
      const res = await api.get('/incidents');
      setIncidents(res.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los incidentes.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, []));
  const onRefresh = useCallback(() => { setIsRefreshing(true); fetchData(); }, []);

  const openFormModal = (incident = initialFormState) => {
    setFormState(incident);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formState.description) {
      Alert.alert("Campo requerido", "La descripción es obligatoria.");
      return;
    }
    setIsSubmitting(true);
    const isUpdating = !!formState.id;
    const method = isUpdating ? 'put' : 'post';
    const url = isUpdating ? `/incidents/${formState.id}` : '/incidents';

    try {
      await api[method](url, formState);
      Alert.alert("Éxito", `Incidente ${isUpdating ? 'actualizado' : 'creado'} correctamente.`);
      setModalVisible(false);
      fetchData();
    } catch (error) {
      Alert.alert("Error", `No se pudo ${isUpdating ? 'actualizar' : 'crear'} el incidente.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar este incidente?", [
      { text: "Cancelar" },
      {
        text: "Eliminar", style: "destructive",
        onPress: async () => {
          try {
            await api.del(`/incidents/${id}`);
            fetchData();
          } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el incidente.");
          }
        }
      }
    ]);
  };

  if (loading && !isRefreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Incidentes</Text>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => openFormModal(item)} style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Incidente #{item.id}</Text>
              <Text>{item.description}</Text>
              <Text style={styles.cardDate}>Reportado: {new Date(item.createdAt).toLocaleDateString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <FontAwesome5 name="trash-alt" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay incidentes reportados.</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => openFormModal()}>
        <FontAwesome5 name="plus" size={20} color="white" />
      </TouchableOpacity>
      <IncidentForm
        visible={modalVisible}
        onSave={handleSave}
        onCancel={() => setModalVisible(false)}
        incident={formState}
        setIncident={setFormState}
        loading={isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', padding: 20, backgroundColor: 'white' },
  card: {
    backgroundColor: 'white', marginVertical: 8, marginHorizontal: 12,
    borderRadius: 8, padding: 15, elevation: 3, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center'
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  cardDate: { fontSize: 12, color: 'gray', marginTop: 8 },
  deleteButton: { padding: 10 },
  fab: {
    position: 'absolute', right: 20, bottom: 20, backgroundColor: '#007AFF',
    width: 56, height: 56, borderRadius: 28, justifyContent: 'center',
    alignItems: 'center', elevation: 8
  },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#F0F2F5' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: 'white' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray' }
});
