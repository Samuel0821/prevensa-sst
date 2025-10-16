// app-mobile/src/navigation/UserTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IncidentsScreen from "../screens/user/IncidentsScreen";
import TrainingsScreen from "../screens/user/TrainingsScreen";
import DocumentsScreen from "../screens/user/DocumentsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function UserTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Incidentes" component={IncidentsScreen} />
      <Tab.Screen name="Capacitaciones" component={TrainingsScreen} />
      <Tab.Screen name="Documentos" component={DocumentsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
