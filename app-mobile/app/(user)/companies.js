
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert,
  ActivityIndicator, RefreshControl
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as api from '../../api/api.js';
import { FontAwesome5 } from '@expo/vector-icons';


// --- Componente Formulario para Crear/Editar --- (Simplificado para rol de usuario)
const CompanyForm = ({ visible, onSave, onCancel, company, setCompany, loading }) => (
  <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>{company.id ? "Editar Empresa" : "Nueva Empresa"}</Text>
      <TextInput
        placeholder="Nombre de la empresa"
        style={styles.input}
        value={company.name}
        onChangeText={(text) => setCompany({ ...company, name: text })}
      />
      <TextInput
        placeholder="Dirección"
        style={styles.input}
        value={company.address}
        onChangeText={(text) => setCompany({ ...company, address: text })}
      />
      <View style={styles.buttonContainer}>
        <Button title="Guardar" onPress={onSave} disabled={loading} />
        <Button title="Cancelar" onPress={onCancel} color="#FF3B30" />
      </View>
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }}/>}
    </View>
  </Modal>
);

// --- Pantalla Principal de Empresas ---
export default function CompaniesScreen() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormState = { id: null, name: '', address: '' };
  const [formState, setFormState] = useState(initialFormState);

  const fetchData = async () => {
    try {
      const res = await api.get('/companies');
      setCompanies(res.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las empresas.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, []));
  const onRefresh = useCallback(() => { setIsRefreshing(true); fetchData(); }, []);

  const openFormModal = (company = initialFormState) => {
    setFormState(company);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formState.name) {
      Alert.alert("Campo requerido", "El nombre de la empresa es obligatorio.");
      return;
    }
    setIsSubmitting(true);
    const isUpdating = !!formState.id;
    const method = isUpdating ? 'put' : 'post';
    const url = isUpdating ? `/companies/${formState.id}` : '/companies';

    try {
      await api[method](url, formState);
      Alert.alert("Éxito", `Empresa ${isUpdating ? 'actualizada' : 'creada'} correctamente.`);
      setModalVisible(false);
      fetchData(); // Recargar lista
    } catch (error) {
      Alert.alert("Error", `No se pudo ${isUpdating ? 'actualizar' : 'crear'} la empresa.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // La función para eliminar se ha quitado para el rol de usuario

  if (loading && !isRefreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Empresas</Text>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openFormModal(item)} style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardAddress}><FontAwesome5 name="map-marker-alt" /> {item.address || "Dirección no especificada"}</Text>
             {/* Botón de eliminar quitado */}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay empresas registradas.</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => openFormModal()}> 
        <FontAwesome5 name="plus" size={20} color="white" />
      </TouchableOpacity>
      <CompanyForm 
        visible={modalVisible} 
        onSave={handleSave} 
        onCancel={() => setModalVisible(false)}
        company={formState} 
        setCompany={setFormState} 
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
    backgroundColor: 'white', 
    marginVertical: 8, 
    marginHorizontal:12, 
    borderRadius: 8, 
    padding: 15, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardAddress: { fontSize: 14, color: '#555' },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalContainer: { justifyContent: 'center', padding: 30, backgroundColor: '#F0F2F5', flexGrow: 1 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
});
