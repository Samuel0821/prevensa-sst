import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// Forzando la reconstrucción para limpiar el caché.

export default defineConfig({
  plugins: [react()],
});