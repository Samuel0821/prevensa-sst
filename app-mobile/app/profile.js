
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil de Usuario</Text>
            {user && (
                <View>
                    <Text>Nombre: {user.name}</Text>
                    <Text>Email: {user.email}</Text>
                    <Text>Rol: {user.role}</Text>
                </View>
            )}
            <View style={styles.buttonContainer}>
              <Button title="Cerrar Sesión" onPress={logout} color="#FF3B30" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 30, 
        width: '80%',
    }
});
