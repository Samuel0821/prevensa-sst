
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function UserLayout() {
  return (
    <Tabs 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'incidents') {
            iconName = focused ? 'ios-alert-circle' : 'ios-alert-circle-outline';
          } else if (route.name === 'trainings') {
            iconName = focused ? 'ios-school' : 'ios-school-outline';
          } else if (route.name === 'documents') {
            iconName = focused ? 'ios-document-text' : 'ios-document-text-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'ios-person-circle' : 'ios-person-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Ocultamos los encabezados por defecto, cada pantalla los gestionará
      })}
    >
      <Tabs.Screen name="incidents" options={{ title: 'Incidentes' }} />
      <Tabs.Screen name="trainings" options={{ title: 'Capacitaciones' }} />
      <Tabs.Screen name="documents" options={{ title: 'Documentos' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
