
// mobile/components/common/NotificationIcon.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useNotifications } from '../../context/NotificationContext'; // Ajusta la ruta si es necesario

const NotificationIcon = () => {
  const navigation = useNavigation();
  const { hasUnreadNotifications } = useNotifications();

  return (
    <View style={styles.container}>
      <Ionicons
        name="notifications-outline"
        size={28}
        color="#333"
        onPress={() => navigation.navigate('Notifications')}
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
