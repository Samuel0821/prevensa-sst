// app-mobile/app/(admin)/companies.js
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '../../api/api'; // CORRECCIÓN: Importación por defecto
import { FontAwesome5 } from '@expo/vector-icons';

const initialState = { id: null, name: '', nit: '', address: '', phone: '' };

const CompanyForm = ({ visible, onSave, onCancel, company, setCompany, loading }) => {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{company.id ? "Editar Empresa" : "Nueva Empresa"}</Text>
        <TextInput placeholder="Nombre de la empresa" style={styles.input} value={company.name} onChangeText={(text) => setCompany({ ...company, name: text })} />
        <TextInput placeholder="NIT" style={styles.input} value={company.nit} onChangeText={(text) => setCompany({ ...company, nit: text })} keyboardType="numeric" />
        <TextInput placeholder="Dirección" style={styles.input} value={company.address} onChangeText={(text) => setCompany({ ...company, address: text })} />
        <TextInput placeholder="Teléfono" style={styles.input} value={company.phone} onChangeText={(text) => setCompany({ ...company, phone: text })} keyboardType="phone-pad" />
        <View style={styles.buttonContainer}>
          <Button title="Guardar" onPress={onSave} disabled={loading} />
          <Button title="Cancelar" onPress={onCancel} color="#FF3B30" />
        </View>
        {loading && <ActivityIndicator size="large" style={{ marginTop: 10 }}/>}
      </View>
    </Modal>
  );
};

export default function CompaniesScreen() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error("Error al cargar empresas:", error);
      Alert.alert("Error", "No se pudieron cargar las empresas.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchCompanies(); }, []));
  const onRefresh = useCallback(() => { setIsRefreshing(true); fetchCompanies(); }, []);

  const handleSave = async () => {
    if (!selectedCompany.name || !selectedCompany.nit) {
        Alert.alert("Campos obligatorios", "El nombre y el NIT de la empresa son requeridos.");
        return;
    }

    setIsSubmitting(true);
    const isUpdating = !!selectedCompany.id;
    const url = isUpdating ? `/companies/${selectedCompany.id}` : '/companies';
    const method = isUpdating ? 'put' : 'post';

    try {
      await api[method](url, selectedCompany);
      Alert.alert("Éxito", `Empresa ${isUpdating ? 'actualizada' : 'creada'} correctamente.`);
      setModalVisible(false);
      fetchCompanies();
    } catch (error) {
      const errorMsg = error.response?.data?.message || `No se pudo ${isUpdating ? 'actualizar' : 'crear'} la empresa.`;
      Alert.alert("Error", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const performDelete = async (id) => {
    try {
      await api.delete(`/companies/${id}`);
      Alert.alert("Éxito", "Empresa eliminada correctamente.");
      fetchCompanies(); // Recargar la lista
    } catch (error) {
      console.error("Error al eliminar la empresa:", error.response?.data || error.message);
      Alert.alert("Error", "No se pudo eliminar la empresa. Verifique la consola para más detalles.");
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás realmente seguro de que deseas eliminar esta empresa?",
      [
        { text: "Cancelar", style: 'cancel' },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: () => performDelete(id) 
        }
      ]
    );
  };

  const openModal = (company = initialState) => {
    setSelectedCompany(company);
    setModalVisible(true);
  };
  
  if (loading && !isRefreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>NIT: {item.nit}</Text>
              <Text>{item.address}</Text>
              <Text>{item.phone}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => openModal(item)} style={styles.actionButton}>
                <FontAwesome5 name="edit" size={18} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                <FontAwesome5 name="trash" size={18} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay empresas registradas.</Text>}
      />
       <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
         <FontAwesome5 name="plus" size={20} color="white" />
       </TouchableOpacity>
      <CompanyForm 
        visible={modalVisible} 
        onSave={handleSave} 
        onCancel={() => setModalVisible(false)} 
        company={selectedCompany} 
        setCompany={setSelectedCompany}
        loading={isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', marginVertical: 8, marginHorizontal:16, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3 },
  cardContent: { padding: 16, flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 14, color: 'gray', marginBottom: 4 },
  cardActions: { flexDirection: 'row', padding: 8 },
  actionButton: { padding: 8 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#F9F9F9' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: 'white' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
});
