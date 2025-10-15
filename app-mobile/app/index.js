//app-mobile/app/index.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "../api/api";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tus credenciales");
      return;
    }

    try {
      console.log("🚀 Enviando login a:", api.defaults.baseURL);
      const response = await api.post("/auth/login", { email, password });

      if (response.status === 200) {
        Alert.alert("Éxito", "Inicio de sesión correcto");
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error.message);
      Alert.alert("Error", "Credenciales inválidas o servidor inaccesible");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prevensa SST</Text>

      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  button: {
    backgroundColor: "#1E40AF",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
