// app-mobile/src/screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api from "../../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tus credenciales");
      return;
    }

    try {
      console.log("🚀 Enviando login al backend...");
      const res = await api.post("/auth/login", { email, password }); // <-- igual que tu backend web
      console.log("✅ Respuesta:", res.data);

      const { token, user } = res.data;

      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

      if (user.role === "admin") {
        navigation.replace("AdminTabs");
      } else {
        navigation.replace("UserTabs");
      }
    } catch (err) {
      console.error("❌ Error en login:", err.response?.data || err.message);
      Alert.alert("Error", "No se pudo iniciar sesión. Verifica credenciales o conexión.");
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
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8FAFC", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1E40AF", marginBottom: 30 },
  input: { width: "100%", backgroundColor: "#fff", borderRadius: 10, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: "#E5E7EB" },
  button: { backgroundColor: "#1E40AF", padding: 15, borderRadius: 10, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
