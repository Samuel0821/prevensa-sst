// app-mobile/src/utils/auth.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveSession = async ({ token, user }) => {
  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("user", JSON.stringify(user));
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const clearSession = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
};
