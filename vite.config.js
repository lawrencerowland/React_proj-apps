import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/React_proj-apps/' : '/',
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: "./src/setupTests.js",
    environment: 'jsdom',
  },
})
