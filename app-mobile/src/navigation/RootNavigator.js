// app-mobile/src/navigation/RootNavigator.js
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "../screens/LoginScreen";
import AdminTabs from "./AdminTabs";
import UserTabs from "./UserTabs";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const loadRole = async () => {
      const role = await AsyncStorage.getItem("userRole");
      setUserRole(role);
    };
    loadRole();
  }, []);

  if (userRole === null) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userRole === "admin" ? (
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
      ) : userRole === "user" ? (
        <Stack.Screen name="UserTabs" component={UserTabs} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
