import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
const appName = process.env.APP || 'project-management-simulation';

export default defineConfig({
  root: resolve(__dirname, `apps/${appName}`),
  // make built paths portable to any host folder
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  build: {
    outDir: resolve(__dirname, `docs/apps/${appName}`),
  },
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: resolve(__dirname, 'src/common/setupTests.js'),
    environment: 'jsdom',
  },
})
