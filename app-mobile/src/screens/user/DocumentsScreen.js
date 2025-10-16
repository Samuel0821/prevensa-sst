// app-mobile/src/screens/User/DocumentsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import api from "../../../api/api";

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documents");
      setDocuments(response.data);
    } catch (error) {
      console.error("Error al obtener documentos:", error.message);
      Alert.alert("Error", "No se pudieron cargar los documentos.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async (url) => {
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "No se puede abrir el documento.");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📂 Documentos SST</Text>

      <FlatList
        data={documents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>📄 {item.title}</Text>
            <Text style={styles.text}>📅 {item.date}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleOpen(item.url)}
            >
              <Text style={styles.buttonText}>Ver documento</Text>
            </TouchableOpacity>
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
  button: {
    backgroundColor: "#1E40AF",
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
