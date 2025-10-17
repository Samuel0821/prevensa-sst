
import React from 'react';
import { Tabs } from 'expo-router';

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#007AFF' }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Dashboard',
        }}
      />
      <Tabs.Screen 
        name="users" 
        options={{ 
          title: 'Usuarios',
        }} 
      />
    </Tabs>
  );
}
