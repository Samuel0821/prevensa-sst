
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Por favor, ingrese usuario y contraseña.');
            return;
        }

        setLoading(true);
        try {
            // Delegamos TODA la lógica de inicio de sesión al AuthContext
            await login({ username, password });
            // No necesitamos hacer nada más aquí, el _layout se encargará de la redirección
        } catch (error) {
            // Si el contexto lanza un error (e.g., 400, 401, 404), lo mostramos
            const errorMessage = 
                error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'Usuario o contraseña incorrectos.';
            Alert.alert('Error de Login', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido</Text>
            <TextInput
                style={styles.input}
                placeholder="Usuario (email)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Iniciar Sesión" onPress={handleLogin} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5', // Un color de fondo suave
    },
    title: {
        fontSize: 28, // Tamaño más grande
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24, // Más espacio
        color: '#333',
    },
    input: {
        height: 50, // Más alto para mejor toque
        borderColor: '#ddd', // Borde más suave
        borderWidth: 1,
        marginBottom: 16, // Más espacio
        paddingHorizontal: 15, // Más padding interno
        borderRadius: 8, // Bordes más redondeados
        backgroundColor: '#fff',
        fontSize: 16,
    },
});

