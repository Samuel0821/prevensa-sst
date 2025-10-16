// app-mobile/src/screens/User/IncidentsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import api from "../../../api/api";

export default function IncidentsScreen() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      const response = await api.get("/incidents");
      setIncidents(response.data);
    } catch (error) {
      console.error("❌ Error al cargar incidentes:", error.message);
      Alert.alert("Error", "No se pudieron cargar los incidentes.");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await api.put(`/incidents/${id}`, { status: "Resuelto" });
      Alert.alert("Éxito", "Incidente marcado como resuelto.");
      fetchIncidents();
    } catch (error) {
      console.error("Error al resolver incidente:", error.message);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠️ Reportes de Incidentes</Text>

      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>📅 {item.date}</Text>
            <Text style={styles.text}>📍 {item.location}</Text>
            <Text style={styles.text}>💬 {item.description}</Text>
            <Text style={[styles.status, { color: item.status === "Resuelto" ? "green" : "orange" }]}>
              Estado: {item.status}
            </Text>
            {item.status !== "Resuelto" && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleResolve(item.id)}
              >
                <Text style={styles.buttonText}>Marcar como resuelto</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#1E40AF", marginBottom: 15 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 15, marginBottom: 10, elevation: 2 },
  text: { fontSize: 14, color: "#1E293B" },
  status: { marginTop: 5, fontWeight: "bold" },
  button: {
    backgroundColor: "#1E40AF",
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
