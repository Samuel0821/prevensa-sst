
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '../../api/api';
import { Ionicons } from '@expo/vector-icons';

const ProfileInfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
        <Ionicons name={icon} size={24} color="#555" />
        <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
);

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const response = await getProfile();
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
            Alert.alert('Error', 'No se pudo cargar el perfil. Intenta de nuevo.');
        }
    };

    // Carga el perfil cada vez que la pantalla se enfoca
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchProfile().finally(() => setLoading(false));
        }, [])
    );

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/'); // Redirige a la pantalla de login
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007AFF" style={styles.centered} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mi Perfil</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.profileCard}>
                    <Ionicons name="person-circle-outline" size={80} color="#007AFF" style={styles.avatar} />
                    {user ? (
                        <>
                            <ProfileInfoRow icon="person-outline" label="Nombre" value={user.name} />
                            <ProfileInfoRow icon="mail-outline" label="Email" value={user.email} />
                            <ProfileInfoRow icon="shield-checkmark-outline" label="Rol" value={user.role} />
                        </>
                    ) : (
                        <Text style={styles.errorText}>No se pudo cargar la información del perfil.</Text>
                    )}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F0F7' },
    header: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
    title: { fontSize: 28, fontWeight: 'bold' },
    content: { flex: 1, padding: 20, justifyContent: 'space-between' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    profileCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 20, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 4 },
    avatar: { marginBottom: 20 },
    infoRow: { flexDirection: 'row', alignItems: 'center', width: '100%', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    infoTextContainer: { marginLeft: 15, flex: 1 },
    infoLabel: { fontSize: 14, color: '#888', marginBottom: 2 },
    infoValue: { fontSize: 16, fontWeight: '500' },
    errorText: { fontSize: 16, color: 'red' },
    logoutButton: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#FFD5D2', marginTop: 20, marginBottom: 40 },
    logoutButtonText: { color: '#FF3B30', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
});
