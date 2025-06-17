import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'apps/project-management-simulation'),
  base:
    process.env.NODE_ENV === 'production'
      ? '/React_proj-apps/apps/project-management-simulation/'
      : '/',
  build: {
    outDir: resolve(__dirname, 'docs/apps/project-management-simulation'),
  },
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: resolve(__dirname, 'src/common/setupTests.js'),
    environment: 'jsdom',
  },
})
