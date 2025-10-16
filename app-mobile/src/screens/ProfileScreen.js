// app-mobile/src/screens/ProfileScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { clearSession, getUser } from "../utils/auth";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const u = await getUser();
      setUser(u);
    })();
  }, []);

  const handleLogout = async () => {
    await clearSession();
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      {user && (
        <>
          <Text>👤 {user.name}</Text>
          <Text>📧 {user.email}</Text>
          <Text>🔑 Rol: {user.role}</Text>
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8FAFC" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1E40AF", marginBottom: 20 },
  button: { backgroundColor: "#DC2626", padding: 12, borderRadius: 10, marginTop: 20 },
  buttonText: { color: "#FFF", fontWeight: "bold" },
});
