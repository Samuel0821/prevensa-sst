
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert,
  ActivityIndicator, RefreshControl, ScrollView, Platform
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '../../api/api';
import { FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- FORMULARIO DE CAPACITACIÓN (IDÉNTICO AL DE ADMIN) ---
const TrainingForm = ({ visible, onSave, onCancel, training, setTraining, companies, loading }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setTraining({ ...training, date: formattedDate });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <ScrollView contentContainerStyle={styles.modalContainer}>
        <Text style={styles.modalTitle}>Nueva Capacitación</Text>
        <TextInput
          placeholder="Tema"
          style={styles.input}
          value={training.topic}
          onChangeText={(text) => setTraining({ ...training, topic: text })}
        />
        <TextInput
          placeholder="Capacitador"
          style={styles.input}
          value={training.trainer}
          onChangeText={(text) => setTraining({ ...training, trainer: text })}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>{training.date || 'Seleccionar Fecha'}</Text>
            <FontAwesome5 name="calendar-alt" size={20} color="#444"/>
        </TouchableOpacity>
        {showDatePicker && (
            <DateTimePicker
                value={new Date(training.date || Date.now())}
                mode="date"
                display="default"
                onChange={onDateChange}
            />
        )}
        <TextInput
          placeholder="Nº de participantes"
          style={styles.input}
          value={String(training.participants)}
          onChangeText={(text) => setTraining({ ...training, participants: text })}
          keyboardType="numeric"
        />
        <View style={styles.input}>
          <Picker
            selectedValue={training.company_id}
            onValueChange={(itemValue) => setTraining({ ...training, company_id: itemValue })}
          >
            <Picker.Item label="Asignar a Empresa..." value={null} />
            {companies.map(c => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
          </Picker>
        </View>
        <View style={styles.input}>
          <Picker
            selectedValue={training.status}
            onValueChange={(itemValue) => setTraining({ ...training, status: itemValue })}
          >
            <Picker.Item label="Pendiente" value="Pendiente" />
            <Picker.Item label="Completada" value="Completada" />
            <Picker.Item label="Cancelada" value="Cancelada" />
          </Picker>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Guardar" onPress={onSave} disabled={loading} />
          <Button title="Cancelar" onPress={onCancel} color="#FF3B30" />
        </View>
        {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }}/>}
      </ScrollView>
    </Modal>
  );
};

// --- COMPONENTES DE ESTADO (IDÉNTICOS A ADMIN) ---
const StatusBadge = ({ status, onPress }) => {
  const statusInfo = {
    Pendiente: { color: '#FF9500', icon: 'hourglass-half' },
    Completada: { color: '#34C759', icon: 'check-circle' },
    Cancelada: { color: '#FF3B30', icon: 'times-circle' },
  };
  const { color, icon } = statusInfo[status] || { color: '#8E8E93', icon: 'question-circle' };

  return (
    <TouchableOpacity onPress={onPress} style={[styles.statusBadge, { backgroundColor: color }]}>
      <FontAwesome5 name={icon} size={14} color="white" />
      <Text style={styles.statusBadgeText}>{status}</Text>
    </TouchableOpacity>
  );
};

const StatusUpdateModal = ({ visible, onSave, onCancel, currentStatus, onStatusChange, loading }) => (
  <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onCancel}>
    <View style={styles.modalOverlay}>
      <View style={styles.statusModalContainer}>
        <Text style={styles.modalTitle}>Cambiar Estado</Text>
        <Picker selectedValue={currentStatus} onValueChange={onStatusChange}>
          <Picker.Item label="Pendiente" value="Pendiente" />
          <Picker.Item label="Completada" value="Completada" />
          <Picker.Item label="Cancelada" value="Cancelada" />
        </Picker>
        <View style={styles.buttonContainer}>
          <Button title="Guardar" onPress={onSave} disabled={loading} />
          <Button title="Cancelar" onPress={onCancel} color="#FF3B30" />
        </View>
      </View>
    </View>
  </Modal>
);

// --- PANTALLA DE CAPACITACIONES PARA USUARIO ---
export default function TrainingsScreen() {
  const [trainings, setTrainings] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const initialFormState = { topic: '', trainer: '', date: '', participants: '0', company_id: null, status: 'Pendiente', description: '' };
  const [formState, setFormState] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const fetchData = async () => {
    try {
      const [trainingsRes, companiesRes] = await Promise.all([api.get('/trainings'), api.get('/companies')]);
      setTrainings(trainingsRes.data);
      setCompanies(companiesRes.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, []));
  const onRefresh = useCallback(() => { setIsRefreshing(true); fetchData(); }, []);

  const handleSave = async () => {
    if (!formState.topic || !formState.date || !formState.trainer) {
      Alert.alert("Campos incompletos", "Complete tema, capacitador y fecha.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/trainings', { ...formState, description: formState.topic });
      Alert.alert("Éxito", "Capacitación creada.");
      setModalVisible(false);
      setFormState(initialFormState);
      fetchData();
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la capacitación.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openStatusModal = (training) => {
    setSelectedTraining(training);
    setNewStatus(training.status);
    setStatusModalVisible(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedTraining || !newStatus) return;
    setIsSubmitting(true);
    try {
      const payload = { ...selectedTraining, status: newStatus };
      await api.put(`/trainings/${payload.id}`, payload);
      setTrainings(prev => prev.map(t => t.id === payload.id ? { ...t, status: newStatus } : t));
      Alert.alert('Éxito', 'Estado actualizado.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado.');
    } finally {
      setIsSubmitting(false);
      setStatusModalVisible(false);
      setSelectedTraining(null);
    }
  };

  // No hay función handleDelete para el rol 'user'

  if (loading && !isRefreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Capacitaciones</Text>
      <FlatList
        data={trainings}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.topic}</Text>
              <StatusBadge status={item.status} onPress={() => openStatusModal(item)} />
            </View>
            <Text style={styles.cardDescription}>{item.description || "Sin descripción"}</Text>
            <View style={styles.separator} />
            <Text style={styles.cardInfo}><FontAwesome5 name="building"/> {item.company_name || 'N/A'}</Text>
            <Text style={styles.cardInfo}><FontAwesome5 name="chalkboard-teacher"/> {item.trainer}</Text>
            <Text style={styles.cardInfo}><FontAwesome5 name="calendar-alt"/> {new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.cardInfo}><FontAwesome5 name="users"/> {item.participants} Asistentes</Text>
            {/* El botón de eliminar se omite aquí */}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay capacitaciones programadas.</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <FontAwesome5 name="plus" size={20} color="white" />
      </TouchableOpacity>
      <TrainingForm 
        visible={modalVisible} 
        onSave={handleSave} 
        onCancel={() => {setModalVisible(false); setFormState(initialFormState);}}
        training={formState} 
        setTraining={setFormState} 
        companies={companies} 
        loading={isSubmitting} 
      />
      {selectedTraining && (
        <StatusUpdateModal
          visible={statusModalVisible}
          onCancel={() => setStatusModalVisible(false)}
          onSave={handleUpdateStatus}
          onStatusChange={setNewStatus}
          currentStatus={newStatus}
          loading={isSubmitting}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', padding: 20, backgroundColor: 'white' },
  card: { backgroundColor: 'white', marginVertical: 8, marginHorizontal: 12, borderRadius: 8, elevation: 3, paddingVertical: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingBottom: 5 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, marginRight: 10 },
  cardDescription: { fontSize: 14, color: '#666', paddingHorizontal: 15, paddingTop: 5, paddingBottom: 10 },
  separator: { height: 1, backgroundColor: '#eee', marginHorizontal: 15, marginBottom: 10 },
  cardInfo: { fontSize: 14, color: '#333', paddingHorizontal: 15, marginBottom: 6 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalContainer: { justifyContent: 'center', padding: 30, backgroundColor: '#F0F2F5', flexGrow: 1 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, marginBottom: 15, backgroundColor: '#fff', justifyContent: 'center' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15 },
  statusBadgeText: { color: 'white', fontWeight: 'bold', marginLeft: 5 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  statusModalContainer: { width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20, elevation: 10 },
  datePickerButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
  datePickerText: { fontSize: 16, color: '#333' }
});
