import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/telecallingcrm.linkarise.in/', // <--- important for GitHub Pages
  build: {
    chunkSizeWarningLimit: 3000,
  },
});
