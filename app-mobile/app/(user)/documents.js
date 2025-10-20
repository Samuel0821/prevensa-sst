
import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput,
    Button, Alert, RefreshControl, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as api from '../../api/api.js';
import { FontAwesome5 } from '@expo/vector-icons';

// --- Componente de Formulario para Crear/Editar Documento ---
const DocumentForm = ({ visible, onSave, onCancel, document, setDocument, loading }) => (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{document.id ? "Editar Documento" : "Nuevo Documento"}</Text>
            <TextInput
                placeholder="Nombre del documento"
                style={styles.input}
                value={document.name}
                onChangeText={(text) => setDocument({ ...document, name: text })}
            />
            <TextInput
                placeholder="URL del documento"
                style={styles.input}
                value={document.url}
                onChangeText={(text) => setDocument({ ...document, url: text })}
                autoCapitalize="none"
                keyboardType="url"
            />
            <View style={styles.buttonContainer}>
                <Button title="Guardar" onPress={onSave} disabled={loading} />
                <Button title="Cancelar" onPress={onCancel} color="#FF3B30" />
            </View>
            {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
        </View>
    </Modal>
);

// --- Pantalla Principal de Documentos ---
export default function DocumentsScreen() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialFormState = { id: null, name: '', url: '' };
    const [formState, setFormState] = useState(initialFormState);

    const fetchData = async () => {
        try {
            const res = await api.get('/documents');
            setDocuments(res.data);
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar los documentos.");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, []));
    const onRefresh = useCallback(() => { setIsRefreshing(true); fetchData(); }, []);

    const openFormModal = (document = initialFormState) => {
        setFormState(document);
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!formState.name || !formState.url) {
            Alert.alert("Campos requeridos", "El nombre y la URL son obligatorios.");
            return;
        }
        setIsSubmitting(true);
        const isUpdating = !!formState.id;
        const method = isUpdating ? 'put' : 'post';
        const url = isUpdating ? `/documents/${formState.id}` : '/documents';

        try {
            await api[method](url, formState);
            Alert.alert("Éxito", `Documento ${isUpdating ? 'actualizado' : 'creado'} correctamente.`);
            setModalVisible(false);
            fetchData(); // Recargar
        } catch (error) {
            Alert.alert("Error", `No se pudo ${isUpdating ? 'guardar' : 'crear'} el documento.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que quieres eliminar este documento?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.del(`/documents/${id}`);
                            Alert.alert("Éxito", "Documento eliminado.");
                            fetchData(); // Recargar
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar el documento.");
                        }
                    }
                }
            ]
        );
    };
    
    if (loading && !isRefreshing) {
        return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Documentos</Text>
            <FlatList
                data={documents}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => openFormModal(item)} style={styles.cardContent}> 
                            <FontAwesome5 name="file-alt" size={20} color="#007AFF" />
                            <View style={styles.cardText}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.cardUrl} numberOfLines={1}>{item.url}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                            <FontAwesome5 name="trash-alt" size={18} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No hay documentos disponibles.</Text>}
            />
             <TouchableOpacity style={styles.fab} onPress={() => openFormModal()}> 
                <FontAwesome5 name="plus" size={20} color="white" />
            </TouchableOpacity>
            <DocumentForm 
                visible={modalVisible} 
                onSave={handleSave} 
                onCancel={() => setModalVisible(false)}
                document={formState} 
                setDocument={setFormState} 
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
        justifyContent: 'space-between',
        padding: 15,
    },
    cardContent: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1 
    },
    cardText: { marginLeft: 15, flex: 1 },
    cardTitle: { fontSize: 18, fontWeight: 'bold' },
    cardUrl: { fontSize: 14, color: '#555', marginTop: 3 },
    deleteButton: { padding: 10, marginLeft: 10 },
    fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
    modalContainer: { justifyContent: 'center', padding: 30, backgroundColor: '#F0F2F5', flexGrow: 1 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
    emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
});
