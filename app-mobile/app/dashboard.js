//app-mobile/app/dashboard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenido al Panel de Prevensa SST</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace("/")}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#E0F2FE" },
  text: { fontSize: 20, fontWeight: "bold", color: "#1E3A8A", marginBottom: 30 },
  logoutButton: { backgroundColor: "#DC2626", padding: 12, borderRadius: 10 },
  logoutText: { color: "#FFF", fontWeight: "bold" },
});
