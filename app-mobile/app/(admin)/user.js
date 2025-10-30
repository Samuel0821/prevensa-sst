
// app-mobile/app/(admin)/user.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert,
  ActivityIndicator, RefreshControl
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import api from '../../api/api'; // CORRECCIÓN: Importación por defecto
import { FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

// Estado inicial del formulario de usuario
const initialFormState = { id: null, name: '', email: '', role: 'user', password: '' };

// --- COMPONENTE DEL FORMULARIO DE USUARIO (MODAL) ---
const UserForm = ({ visible, onSave, onCancel, user, setUser, loading }) => {
  const isEditing = user && user.id;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{isEditing ? "Editar Usuario" : "Nuevo Usuario"}</Text>
        
        <TextInput
          placeholder="Nombre Completo"
          style={styles.input}
          value={user.name}
          onChangeText={(text) => setUser({ ...user, name: text })}
          autoCapitalize="words"
        />
        <TextInput
          placeholder="Correo Electrónico"
          style={styles.input}
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* El campo de contraseña solo se muestra para nuevos usuarios */}
        {!isEditing && (
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            value={user.password}
            onChangeText={(text) => setUser({ ...user, password: text })}
            secureTextEntry
          />
        )}

        {/* Selector de Rol */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={user.role}
            onValueChange={(itemValue) => setUser({ ...user, role: itemValue })}
          >
            <Picker.Item label="Usuario" value="user" />
            <Picker.Item label="Administrador" value="admin" />
          </Picker>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Guardar" onPress={onSave} disabled={loading} />
          <Button title="Cancelar" onPress={onCancel} color="#FF3B30" />
        </View>
        {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }}/>}
      </View>
    </Modal>
  );
};

// --- PANTALLA PRINCIPAL DE GESTIÓN DE USUARIOS ---
export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carga la lista de usuarios desde la API
  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Hooks para cargar y refrescar datos
  useFocusEffect(useCallback(() => { setLoading(true); fetchUsers(); }, []));
  const onRefresh = useCallback(() => { setIsRefreshing(true); fetchUsers(); }, []);

  // Lógica para guardar (crear o actualizar) un usuario
  const handleSave = async () => {
    if (!selectedUser.name || !selectedUser.email || (!selectedUser.id && !selectedUser.password)) {
      Alert.alert("Campos incompletos", "Por favor, rellena todos los campos.");
      return;
    }
    setIsSubmitting(true);

    const isUpdating = !!selectedUser.id;
    const url = isUpdating ? `/users/${selectedUser.id}` : '/users';
    const method = isUpdating ? 'put' : 'post';

    try {
      await api[method](url, selectedUser);
      Alert.alert("Éxito", `Usuario ${isUpdating ? 'actualizado' : 'creado'} correctamente.`);
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      const errorMsg = error.response?.data?.error || `No se pudo ${isUpdating ? 'actualizar' : 'crear'} el usuario.`;
      Alert.alert("Error", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lógica para eliminar un usuario
  const handleDelete = (userId) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.",
      [
        { text: "Cancelar", style: 'cancel' },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/users/${userId}`);
              Alert.alert("Éxito", "Usuario eliminado correctamente.");
              fetchUsers();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el usuario.");
            }
          },
        },
      ]
    );
  };

  // Abre el modal, ya sea para un nuevo usuario o para editar uno existente
  const openModal = (user = initialFormState) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  // Indicador de carga inicial
  if (loading && !isRefreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Gestión de Usuarios</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.email}</Text>
              <View style={[styles.badge, item.role === 'admin' ? styles.badgeAdmin : styles.badgeUser]}>
                <Text style={styles.badgeText}>{item.role}</Text>
              </View>
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
        ListEmptyComponent={<Text style={styles.emptyText}>No hay usuarios registrados.</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <FontAwesome5 name="plus" size={20} color="white" />
      </TouchableOpacity>
      <UserForm
        visible={modalVisible}
        onSave={handleSave}
        onCancel={() => { setModalVisible(false); setSelectedUser(initialFormState); }}
        user={selectedUser}
        setUser={setSelectedUser}
        loading={isSubmitting}
      />
    </View>
  );
}

// --- ESTILOS (MEJORADOS Y UNIFICADOS) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', padding: 20, backgroundColor: 'white' },
  card: { backgroundColor: 'white', marginVertical: 8, marginHorizontal: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3 },
  cardContent: { padding: 16, flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 14, color: 'gray', marginTop: 2, marginBottom: 8 },
  badge: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, alignSelf: 'flex-start' },
  badgeAdmin: { backgroundColor: '#007AFF' },
  badgeUser: { backgroundColor: '#34C759' },
  badgeText: { color: 'white', fontWeight: 'bold', fontSize: 12, textTransform: 'capitalize' },
  cardActions: { flexDirection: 'row', padding: 8 },
  actionButton: { padding: 8 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#F9F9F9' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: 'white' },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 15, backgroundColor: 'white' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
});
