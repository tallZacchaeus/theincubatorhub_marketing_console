import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// Standalone marketing console SPA. Talks to the shared Laravel API over the
// Sanctum stateful-cookie flow (see src/api/client.ts). Runtime API host comes
// from VITE_API_BASE_URL.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5174 },
});
