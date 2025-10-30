// app-mobile/app/(user)/incidents.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert,
  ActivityIndicator, RefreshControl, Image, Platform, ScrollView
} from 'react-native';
import { useFocusEffect, Link } from 'expo-router';
import api from '../../api/api'; // CORRECCIÓN: Importación por defecto
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

// --- FORMULARIO PARA REPORTAR INCIDENTE ---
const IncidentForm = ({ visible, onSave, onCancel, incident, setIncident, companies, loading }) => {

  // Lógica para seleccionar una imagen
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para subir una foto.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setIncident({ ...incident, photo: result.assets[0] });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <ScrollView contentContainerStyle={styles.modalContainer}>
        <Text style={styles.modalTitle}>Reportar Incidente</Text>
        
        <TextInput
          placeholder="Descripción detallada del incidente"
          style={[styles.input, { height: 120 }]}
          value={incident.description}
          onChangeText={(text) => setIncident({ ...incident, description: text })}
          multiline
        />
        <TextInput
          placeholder="Ubicación (Ej: Planta de Producción, Oficina 201)"
          style={styles.input}
          value={incident.location}
          onChangeText={(text) => setIncident({ ...incident, location: text })}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={incident.company_id}
            onValueChange={(itemValue) => setIncident({ ...incident, company_id: itemValue })}
          >
            <Picker.Item label="Seleccionar Empresa..." value="" />
            {companies.map(c => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
          </Picker>
        </View>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <FontAwesome5 name="camera" size={20} color="#555" />
          <Text style={styles.imagePickerText}>{incident.photo ? 'Cambiar Foto' : 'Añadir Foto'}</Text>
        </TouchableOpacity>

        {incident.photo?.uri && <Image source={{ uri: incident.photo.uri }} style={styles.previewImage} />}

        <View style={styles.buttonContainer}>
          <Button title="Enviar Reporte" onPress={onSave} disabled={loading} />
          <Button title="Cancelar" onPress={onCancel} color="#FF3B30" />
        </View>
        {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }}/>}
      </ScrollView>
    </Modal>
  );
};

// Estado inicial del formulario
const initialFormState = { description: '', location: '', company_id: '', photo: null, date: new Date() };

// --- PANTALLA PRINCIPAL DE INCIDENTES PARA USUARIO ---
export default function IncidentsScreen() {
  const [incidents, setIncidents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carga los datos (incidentes y empresas)
  const fetchData = async () => {
    try {
      const [incidentsRes, companiesRes] = await Promise.all([api.get('/incidents/my-incidents'), api.get('/companies')]);
      setIncidents(incidentsRes.data);
      setCompanies(companiesRes.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar tus incidentes.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, []));
  const onRefresh = useCallback(() => { setIsRefreshing(true); fetchData(); }, []);

  // Lógica para guardar el nuevo incidente
  const handleSave = async () => {
    if (!formState.description || !formState.location || !formState.company_id) {
      Alert.alert("Campos incompletos", "Por favor, rellena descripción, ubicación y empresa.");
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('description', formState.description);
    formData.append('location', formState.location);
    formData.append('company_id', formState.company_id);
    formData.append('date', formState.date.toISOString());

    if (formState.photo) {
      const uri = formState.photo.uri;
      const fileType = uri.split('.').pop();
      const fileName = uri.split('/').pop();
      formData.append('photo', { uri, name: fileName, type: `image/${fileType}` });
    }

    try {
      await api.post('/incidents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      Alert.alert("Éxito", "Incidente reportado. Gracias por tu colaboración.");
      setModalVisible(false);
      fetchData();
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el reporte.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !isRefreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Incidentes Reportados</Text>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
        renderItem={({ item }) => {
            const rootUrl = api.defaults.baseURL.replace('/api', '');
            const photoUrl = item.photo ? `${rootUrl}/uploads/${item.photo}` : null;
            return (
              <View style={styles.card}>
                {photoUrl && 
                  <Link href={photoUrl} asChild>
                    <TouchableOpacity>
                        <Image source={{ uri: photoUrl }} style={styles.incidentImage} />
                        <View style={styles.photoOverlay}>
                            <FontAwesome5 name="eye" size={16} color="white" />
                        </View>
                    </TouchableOpacity>
                  </Link>
                }
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.description}</Text>
                    <Text style={styles.cardInfo}><FontAwesome5 name="map-marker-alt"/> {item.location}</Text>
                    <Text style={styles.cardInfo}><FontAwesome5 name="building"/> {item.company_name}</Text>
                    <Text style={styles.cardInfo}><FontAwesome5 name="calendar-alt"/> {new Date(item.date).toLocaleDateString()}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: item.status === 'abierto' ? '#FF9500' : '#34C759' }]}>
                        <Text style={styles.statusText}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
                    </View>
                </View>
              </View>
            )
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>Aún no has reportado ningún incidente.</Text>}
      />
       <TouchableOpacity style={styles.fab} onPress={() => { setFormState(initialFormState); setModalVisible(true); }}>
         <FontAwesome5 name="plus" size={20} color="white" />
       </TouchableOpacity>
      <IncidentForm 
        visible={modalVisible} 
        onSave={handleSave} 
        onCancel={() => setModalVisible(false)} 
        incident={formState} 
        setIncident={setFormState} 
        companies={companies} 
        loading={isSubmitting} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 26, fontWeight: 'bold', padding: 20, backgroundColor: 'white' },
    card: { backgroundColor: 'white', marginVertical: 8, marginHorizontal: 12, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    incidentImage: { width: '100%', height: 180, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
    photoOverlay: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.5)', padding: 7, borderRadius: 20 },
    cardContent: { padding: 15 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    cardInfo: { fontSize: 14, color: '#444', marginBottom: 5 },
    statusBadge: { alignSelf: 'flex-start', marginTop: 10, paddingVertical: 5, paddingHorizontal: 12, borderRadius: 15 },
    statusText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
    modalContainer: { flexGrow: 1, justifyContent: 'center', padding: 25 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
    pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
    imagePicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', padding: 15, borderRadius: 8, justifyContent: 'center', marginBottom: 15 },
    imagePickerText: { marginLeft: 10, fontSize: 16, color: '#555' },
    previewImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 15 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around' },
    emptyText: { textAlign: 'center', marginTop: 50, color: 'gray' },
});
