
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert,
  ActivityIndicator, RefreshControl
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as api from '../../api/api';
import { FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const UserForm = ({ visible, onSave, onCancel, user, setUser, loading }) => {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Nuevo Usuario</Text>
        
        <TextInput
          placeholder="Nombre completo"
          style={styles.input}
          value={user.name}
          onChangeText={(text) => setUser({ ...user, name: text })}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          value={user.password}
          onChangeText={(text) => setUser({ ...user, password: text })}
          secureTextEntry
        />
        
        <View style={styles.input}>
            <Picker
                selectedValue={user.role}
                onValueChange={(itemValue) => setUser({ ...user, role: itemValue })}
            >
                <Picker.Item label="Seleccionar Rol..." value={''} />
                <Picker.Item label="Administrador" value="admin" />
                <Picker.Item label="Usuario" value="user" />
            </Picker>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Guardar" onPress={onSave} disabled={loading} />
          <Button title="Cancelar" onPress={onCancel} color="#FF3B30" />
        </View>
        {loading && <ActivityIndicator size="large" style={{ marginTop: 10 }}/>}
      </View>
    </Modal>
  );
};

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', password: '', role: 'user' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const usersRes = await api.get('/users');
      setUsers(usersRes.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchData(); }, []));
  const onRefresh = useCallback(() => { setIsRefreshing(true); fetchData(); }, []);

  const handleSave = async () => {
    if (!formState.name || !formState.email || !formState.password || !formState.role) {
        Alert.alert("Campos incompletos", "Por favor, complete todos los campos.");
        return;
    }
    setIsSubmitting(true);
    try {
        await api.post('/users', formState);
        Alert.alert("Éxito", "Usuario creado correctamente.");
        setModalVisible(false);
        setFormState({ name: '', email: '', password: '', role: 'user' });
        setLoading(true);
        fetchData();
    } catch (error) {
        const errorMsg = error.response?.data?.message || "No se pudo crear el usuario.";
        Alert.alert("Error", errorMsg);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleDelete = (id) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar este usuario?", [
      { text: "Cancelar" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
          try {
            await api.remove(`/users/${id}`);
            Alert.alert("Éxito", "Usuario eliminado.");
            setLoading(true);
            fetchData();
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo eliminar el usuario.");
          }
      }}
    ]);
  };

  if (loading && !isRefreshing) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Usuarios</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh}/>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text>{item.email}</Text>
                <View style={[styles.badge, item.role === 'admin' ? styles.badgeAdmin : styles.badgeUser]}>
                    <Text style={styles.badgeText}>{item.role}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                    <FontAwesome5 name="trash" size={18} color="#FF3B30" />
                </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay usuarios registrados.</Text>}
      />
       <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
         <FontAwesome5 name="plus" size={20} color="white" />
       </TouchableOpacity>
      <UserForm 
        visible={modalVisible} 
        onSave={handleSave} 
        onCancel={() => setModalVisible(false)} 
        user={formState} 
        setUser={setFormState} 
        loading={isSubmitting} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 26, fontWeight: 'bold', padding: 20, backgroundColor: 'white' },
  card: { backgroundColor: 'white', marginVertical: 8, marginHorizontal:12, borderRadius: 8, elevation: 3 },
  cardContent: { padding: 15, position: 'relative' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  deleteButton: { position: 'absolute', top: 15, right: 15, padding: 5 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#007AFF', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 30 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15, justifyContent: 'center', backgroundColor: '#fff' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  emptyText: { textAlign: 'center', marginTop: 50, color: 'gray', fontSize: 16 },
  badge: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, alignSelf: 'flex-start', marginTop: 10 },
  badgeAdmin: { backgroundColor: '#007AFF' },
  badgeUser: { backgroundColor: '#34C759' },
  badgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
});
