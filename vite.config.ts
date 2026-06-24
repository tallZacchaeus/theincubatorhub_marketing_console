import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Standalone marketing console SPA (React). Talks to the shared Laravel API over
// the Sanctum stateful-cookie flow (ported in a later phase). Runtime API host
// comes from VITE_API_BASE_URL. Dev server runs on 5174 to match the prior setup.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: { port: 5174 },
});
