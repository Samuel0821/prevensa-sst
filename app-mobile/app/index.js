
// app-mobile/app/index.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import { FontAwesome5 } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos incompletos', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Corregido: Usar la clave 'token' para ser consistente
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
      if (user.role === 'admin') {
        router.replace('/(admin)/dashboard');
      } else {
        router.replace('/(user)');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      Alert.alert('Error de autenticación', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
        <Image source={require('../assets/images/Logo_Prevensap.jpg')} style={styles.logo} />
        <Text style={styles.title}>Bienvenido a prevensap</Text>
        <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>

        <View style={styles.inputContainer}>
            <FontAwesome5 name="envelope" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
        </View>

        <View style={styles.inputContainer}>
            <FontAwesome5 name="lock" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                <FontAwesome5 name={isPasswordVisible ? 'eye-slash' : 'eye'} size={20} color="#888" />
            </TouchableOpacity>
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
        )}

        <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta? Contacta a tu administrador.</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: '#F0F2F5',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6C6C6E',
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DDD',
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 5,
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loader: {
        marginTop: 20,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
    },
    footerText: {
        color: '#8A8A8E',
        fontSize: 14,
    },
});
