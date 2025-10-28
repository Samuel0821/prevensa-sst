// app-mobile/app/index.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

const logo = require('../assets/images/Logo_Prevensap.jpg');

export default function LoginScreen() {
    const [email, setEmail] = useState(''); // <--- CORREGIDO: de username a email
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) { // <--- CORREGIDO: de username a email
            Alert.alert('Error', 'Por favor, ingrese email y contraseña.'); // <--- Mensaje corregido
            return;
        }

        setLoading(true);
        try {
            await login({ email, password }); // <--- CORREGIDO: Enviar email en lugar de username
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
                placeholder="Email"
                placeholderTextColor="#A9A9A9"
                value={email} // <--- CORREGIDO
                onChangeText={setEmail} // <--- CORREGIDO
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#A9A9A9"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {loading ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
                <Button title="Iniciar Sesión" onPress={handleLogin} color="#FFC107" />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#0052cc',
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
        color: '#FFFFFF',
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
