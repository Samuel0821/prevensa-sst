// app-mobile/App.js
import 'react-native-gesture-handler';
import { ExpoRoot } from 'expo-router';

export default function App() {
  return <ExpoRoot context={require.context('./app', true, /\.js$/)} />;
}
