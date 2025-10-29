
// app-mobile/components/common/NotificationIcon.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotifications } from '../../src/context/NotificationContext'; // Ajusta la ruta si es necesario

const NotificationIcon = () => {
  const router = useRouter();
  const { hasUnreadNotifications } = useNotifications();

  return (
    <View style={styles.container}>
      <Ionicons
        name="notifications-outline"
        size={28}
        color="#333"
        onPress={() => router.push('/notifications')} // Navega a la pantalla de notificaciones
      />
      {hasUnreadNotifications && (
        <View style={styles.unreadBadge} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 20,
  },
  unreadBadge: {
    position: 'absolute',
    right: 2,
    top: 3,
    backgroundColor: 'red',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
});

export default NotificationIcon;
