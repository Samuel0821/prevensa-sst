
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createIncident } from '../../api/api';
import { Ionicons } from '@expo/vector-icons';

export default function CreateIncidentScreen() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [type, setType] = useState('INCIDENTE'); // Por defecto
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (description.trim() === '') {
      Alert.alert('Campo Requerido', 'Por favor, describe el incidente.');
      return;
    }

    setLoading(true);
    try {
      const incidentData = { description, type };
      await createIncident(incidentData);
      // Navegar atrás y forzar la actualización de la lista
      router.back();
    } catch (error) {
      console.error("Error creating incident:", error);
      Alert.alert('Error', 'No se pudo reportar el incidente. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={30} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Reportar Incidente</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Tipo de Reporte</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'INCIDENTE' && styles.typeButtonActive]}
            onPress={() => setType('INCIDENTE')}
          >
            <Ionicons name="ios-flame" size={20} color={type === 'INCIDENTE' ? '#FFF' : '#007AFF'} style={{marginRight: 5}}/>
            <Text style={[styles.typeButtonText, type === 'INCIDENTE' && styles.typeButtonTextActive]}>Incidente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'CONDICIÓN INSEGURA' && styles.typeButtonActive]}
            onPress={() => setType('CONDICIÓN INSEGURA')}
          >
             <Ionicons name="ios-warning" size={20} color={type === 'CONDICIÓN INSEGURA' ? '#FFF' : '#FF9500'} style={{marginRight: 5}}/>
            <Text style={[styles.typeButtonText, type === 'CONDICIÓN INSEGURA' && styles.typeButtonTextActive]}>Condición Insegura</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          placeholder="Describe lo que ocurrió o la condición observada..."
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Enviar Reporte</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F7' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 10, paddingTop: 50, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
  backButton: { paddingRight: 10 },
  title: { fontSize: 22, fontWeight: 'bold' },
  form: { padding: 20 },
  label: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 10 },
  input: { backgroundColor: '#FFF', borderRadius: 8, padding: 15, fontSize: 16, minHeight: 120, textAlignVertical: 'top', marginBottom: 20 },
  typeSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  typeButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#007AFF' },
  typeButtonActive: { backgroundColor: '#007AFF' },
  typeButtonText: { fontSize: 14, fontWeight: 'bold', color: '#007AFF' },
  typeButtonTextActive: { color: '#FFF' },
  submitButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
