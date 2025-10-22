import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

const logo = require('../assets/images/Logo_Prevensap.jpg');

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
            await login({ username, password });
        } catch (error) {
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
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Prevensap</Text>
            <TextInput
                style={styles.input}
                placeholder="Usuario (email)"
                placeholderTextColor="#A9A9A9" // Color del placeholder
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#A9A9A9" // Color del placeholder
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {loading ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
                <Button title="Iniciar Sesión" onPress={handleLogin} color="#FFC107" /> // Botón con color llamativo
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#0052cc', // Fondo azul corporativo
    },
    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 32, 
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24, 
        color: '#FFFFFF', // Texto blanco
    },
    input: {
        height: 50, 
        borderColor: '#ddd', 
        borderWidth: 1,
        marginBottom: 16, 
        paddingHorizontal: 15, 
        borderRadius: 8, 
        backgroundColor: '#fff',
        fontSize: 16,
    },
});
