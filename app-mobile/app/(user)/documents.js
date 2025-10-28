// app-mobile/app/(user)/documents.js
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert,
  ActivityIndicator, RefreshControl, Platform
} from 'react-native';
import { useFocusEffect, Link } from 'expo-router'; 
import * as DocumentPicker from 'expo-document-picker';
import api from '../../api/api';
import { FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

// --- FORMULARIO PARA SUBIR DOCUMENTOS ---
const DocumentForm = ({ visible, onSave, onCancel, formState, setFormState, companies, loading, pickDocument, selectedFile }) => {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Subir Documento</Text>
        
        <TextInput
          placeholder="Título del documento"
          style={styles.input}
          value={formState.title}
          onChangeText={(text) => setFormState({ ...formState, title: text })}
        />
        
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={formState.company_id}
                onValueChange={(itemValue) => setFormState({ ...formState, company_id: itemValue })}
            >
                <Picker.Item label="Asignar a Empresa..." value="" />
                {companies.map(c => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
            </Picker>
        </View>

        <TouchableOpacity style={styles.input} onPress={pickDocument}>
            <Text style={{color: selectedFile ? '#000' : '#999'}}>
                {selectedFile ? `Archivo: ${selectedFile.name}` : 'Seleccionar archivo'}
            </Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <Button title="Guardar" onPress={onSave} disabled={loading} />
          <Button title="Cancelar" onPress={onCancel} color="#FF3B30" />
        </View>
        {loading && <ActivityIndicator size="large" style={{ marginTop: 10 }}/>}
      </View>
    </Modal>
  );
};

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const initialFormState = { title: '', company_id: '' }; 
  const [formState, setFormState] = useState(initialFormState);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carga los datos iniciales (documentos y empresas)
  const fetchData = async () => {
    try {
      const [docsRes, companiesRes] = await Promise.all([
        api.get('/documents'),
        api.get('/companies')
      ]);
      setDocuments(docsRes.data);
      setCompanies(companiesRes.data);
    } catch (error) {      
      Alert.alert("Error de Conexión", `No se pudieron cargar los datos.`);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, []));
  const onRefresh = useCallback(() => { setIsRefreshing(true); fetchData(); }, []);

  // Abre el selector de archivos del dispositivo
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!result.canceled && result.assets && result.assets.length > 0) {
          setSelectedFile(result.assets[0]);
      }
    } catch (err) {
      Alert.alert("Error", "Hubo un problema al seleccionar el archivo.");
    }
  };

  // Lógica para guardar el nuevo documento
  const handleSave = async () => {
    if (!formState.title || !formState.company_id || !selectedFile) {
        Alert.alert("Campos incompletos", "Complete título, empresa y seleccione un archivo.");
        return;
    }
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('title', formState.title);
    formData.append('company_id', formState.company_id.toString());
    
    const sanitizedName = selectedFile.name.replace(/\s+/g, '_');

    if (Platform.OS === 'web') {
      const response = await fetch(selectedFile.uri);
      const blob = await response.blob();
      formData.append('file', blob, sanitizedName);
    } else {
      formData.append('file', {
        uri: selectedFile.uri,
        name: sanitizedName,
        type: selectedFile.mimeType || 'application/octet-stream',
      });
    }

    try {
        await api.post('/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        Alert.alert("Éxito", "Documento subido correctamente.");
        setModalVisible(false);
        setFormState(initialFormState); 
        setSelectedFile(null);
        fetchData();
    } catch (error) {
        const errorMsg = error.response?.data?.error || "No se pudo subir el documento.";
        Alert.alert("Error al Guardar", errorMsg);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  // Indicador de carga inicial
  if (loading && !isRefreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Documentos de Seguridad</Text>
      <FlatList
        data={documents}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
        renderItem={({ item }) => {
          const hasUrl = typeof item.url === 'string' && item.url;
          const rootUrl = api.defaults.baseURL.replace('/api', '');
          const fullUrl = hasUrl ? `${rootUrl}/uploads/${item.url}` : '';

          return (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                  <FontAwesome5 name={hasUrl && item.url.endsWith('.pdf') ? 'file-pdf' : 'file-alt'} size={24} style={styles.fileIcon} />
                  <View style={styles.contentWrapper}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardSubtitle}><FontAwesome5 name="building"/> {item.company_name}</Text>
                  </View>
                  
                  {hasUrl ? (
                    <Link href={fullUrl} style={styles.actionButton} asChild>
                      <TouchableOpacity>
                        <FontAwesome5 name="eye" size={18} color="#007AFF" />
                      </TouchableOpacity>
                    </Link>
                  ) : (
                    <View style={styles.actionButton}>
                      <FontAwesome5 name="eye-slash" size={18} color="#ccc" />
                    </View>
                  )}

                  {/* Botón de eliminar ELIMINADO para el rol de usuario */}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay documentos disponibles.</Text>}
      />
      {/* Botón para añadir un nuevo documento */}
       <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
         <FontAwesome5 name="plus" size={20} color="white" />
       </TouchableOpacity>
       <DocumentForm
        visible={modalVisible}
        onSave={handleSave}
        onCancel={() => { setModalVisible(false); setFormState(initialFormState); setSelectedFile(null); }}
        formState={formState}
        setFormState={setFormState}
        companies={companies}
        loading={isSubmitting}
        pickDocument={handlePickDocument}
        selectedFile={selectedFile}
      />
    </View>
  );
}

// Estilos (unificados con la versión del admin)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 26, fontWeight: 'bold', padding: 20, backgroundColor: 'white' },
    card: { backgroundColor: 'white', marginVertical: 8, marginHorizontal: 12, borderRadius: 8, elevation: 3 },
    cardContent: { padding: 15, flexDirection: 'row', alignItems: 'center' },
    contentWrapper: { flex: 1 },
    fileIcon: { marginRight: 15, color: '#D32F2F' },
    cardTitle: { fontSize: 16, fontWeight: 'bold' },
    cardSubtitle: { fontSize: 13, color: '#555', marginTop: 2 },
    actionButton: { padding: 10 },
    fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
    modalContainer: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#F0F2F5' },
    modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { height: 50, borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 15, borderRadius: 8, marginBottom: 15, backgroundColor: 'white', justifyContent: 'center' },
    pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 15, backgroundColor: 'white', justifyContent: 'center' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
    emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
});
