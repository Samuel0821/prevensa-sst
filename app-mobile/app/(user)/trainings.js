
import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert,
    RefreshControl, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as api from '../../api/api.js';
import { FontAwesome5 } from '@expo/vector-icons';


// --- Componente de Formulario para Crear/Editar Capacitación ---
const TrainingForm = ({ visible, onSave, onCancel, training, setTraining, loading }) => (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{training.id ? "Editar Capacitación" : "Nueva Capacitación"}</Text>
            <TextInput
                placeholder="Nombre de la capacitación"
                style={styles.input}
                value={training.name}
                onChangeText={(text) => setTraining({ ...training, name: text })}
            />
            <TextInput
                placeholder="Descripción"
                style={[styles.input, { height: 100 }]}
                value={training.description}
                onChangeText={(text) => setTraining({ ...training, description: text })}
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

// --- Pantalla Principal de Capacitaciones ---
export default function TrainingsScreen() {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialFormState = { id: null, name: '', description: '' };
    const [formState, setFormState] = useState(initialFormState);

    const fetchData = async () => {
        try {
            const res = await api.get('/trainings');
            setTrainings(res.data);
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar las capacitaciones.");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, []));
    const onRefresh = useCallback(() => { setIsRefreshing(true); fetchData(); }, []);

    const openFormModal = (training = initialFormState) => {
        setFormState(training);
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!formState.name) {
            Alert.alert("Campo requerido", "El nombre de la capacitación es obligatorio.");
            return;
        }
        setIsSubmitting(true);
        const isUpdating = !!formState.id;
        const method = isUpdating ? 'put' : 'post';
        const url = isUpdating ? `/trainings/${formState.id}` : '/trainings';

        try {
            await api[method](url, formState);
            Alert.alert("Éxito", `Capacitación ${isUpdating ? 'actualizada' : 'creada'} correctamente.`);
            setModalVisible(false);
            fetchData(); // Recargar
        } catch (error) {
            Alert.alert("Error", `No se pudo ${isUpdating ? 'guardar' : 'crear'} la capacitación.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id) => {
        Alert.alert("Confirmar Eliminación", "¿Estás seguro?", [
            { text: "Cancelar" },
            { 
                text: "Eliminar", 
                style: "destructive", 
                onPress: async () => {
                    try {
                        await api.del(`/trainings/${id}`);
                        Alert.alert("Éxito", "Capacitación eliminada.");
                        fetchData(); // Recargar
                    } catch (error) {
                        Alert.alert("Error", "No se pudo eliminar la capacitación.");
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
            <Text style={styles.header}>Capacitaciones</Text>
            <FlatList
                data={trainings}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => openFormModal(item)} style={styles.cardContent}>
                            <FontAwesome5 name="chalkboard-teacher" size={24} color="#007AFF" />
                            <View style={styles.cardText}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardDescription}>{item.description}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                            <FontAwesome5 name="trash-alt" size={18} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay capacitaciones programadas.</Text>}
            />
            <TouchableOpacity style={styles.fab} onPress={() => openFormModal()}> 
                <FontAwesome5 name="plus" size={20} color="white" />
            </TouchableOpacity>
            <TrainingForm 
                visible={modalVisible} 
                onSave={handleSave} 
                onCancel={() => setModalVisible(false)}
                training={formState} 
                setTraining={setFormState} 
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
        marginHorizontal: 12, 
        borderRadius: 8, 
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    cardContent: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1 
    },
    cardText: { marginLeft: 15, flex: 1 },
    cardTitle: { fontSize: 18, fontWeight: 'bold' },
    cardDescription: { fontSize: 14, color: '#555', marginTop: 4 },
    deleteButton: { padding: 10, marginLeft: 10 },
    fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
    modalContainer: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#F0F2F5' },
    modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: 'white' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
    emptyText: { textAlign: 'center', marginTop: 50, color: 'gray' },
});
