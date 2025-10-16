// app-mobile/src/screens/Admin/DashboardAdmin.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert } from "react-native";
import api from "../../../api/api";

export default function DashboardAdmin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      console.log("📊 Obteniendo estadísticas desde backend...");
      const res = await api.get("/dashboard");
      console.log("✅ Respuesta del backend:", res.data);
      setStats(res.data);
    } catch (error) {
      console.error("❌ Error al obtener estadísticas:", error.message);
      Alert.alert("Error", "No se pudieron cargar las estadísticas del panel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E40AF" />
        <Text style={{ marginTop: 10, color: "#475569" }}>Cargando datos...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>No se pudieron cargar los datos.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Panel General de Prevensa SST</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Usuarios</Text>
        <Text style={styles.cardValue}>{stats.users}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Empresas</Text>
        <Text style={styles.cardValue}>{stats.companies}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Incidentes</Text>
        <Text>Total: {stats.incidents.total}</Text>
        <Text>Abiertos: {stats.incidents.open}</Text>
        <Text>Cerrados: {stats.incidents.closed}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Capacitaciones</Text>
        <Text>Total: {stats.trainings.total}</Text>
        <Text>Completadas: {stats.trainings.completed}</Text>
        <Text>Pendientes: {stats.trainings.pending}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Documentos</Text>
        <Text>Total: {stats.documents}</Text>
      </View>

      <Text style={styles.subtitle}>Tendencias recientes</Text>

      {stats.charts.incidentsByMonth.map((item, index) => (
        <Text key={`i-${index}`} style={styles.chartText}>
          📅 {item.month}: {item.total} incidentes
        </Text>
      ))}

      {stats.charts.trainingsByMonth.map((item, index) => (
        <Text key={`t-${index}`} style={styles.chartText}>
          🎓 {item.month}: {item.total} capacitaciones
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1E40AF", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "600", color: "#334155", marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#1E40AF" },
  cardValue: { fontSize: 24, fontWeight: "bold", color: "#0f172a" },
  chartText: { color: "#475569", marginTop: 4 },
});
