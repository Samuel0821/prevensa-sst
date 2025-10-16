// app-mobile/src/screens/User/TrainingsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import api from "../../../api/api";

export default function TrainingsScreen() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainings = async () => {
    try {
      const response = await api.get("/trainings");
      setTrainings(response.data);
    } catch (error) {
      console.error("Error al obtener capacitaciones:", error.message);
      Alert.alert("Error", "No se pudieron cargar las capacitaciones.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.put(`/trainings/${id}`, { status: "Completado" });
      Alert.alert("Éxito", "Capacitación marcada como completada.");
      fetchTrainings();
    } catch (error) {
      console.error("Error al actualizar capacitación:", error.message);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎓 Capacitaciones</Text>

      <FlatList
        data={trainings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>📘 {item.topic}</Text>
            <Text style={styles.text}>📅 {item.date}</Text>
            <Text style={styles.text}>📍 {item.location}</Text>
            <Text style={[styles.status, { color: item.status === "Completado" ? "green" : "orange" }]}>
              Estado: {item.status}
            </Text>

            {item.status !== "Completado" && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleComplete(item.id)}
              >
                <Text style={styles.buttonText}>Marcar como completado</Text>
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
