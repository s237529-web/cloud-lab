import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0",
    port: 5173,

    proxy: {
<<<<<<< HEAD
      '/api': {
        target: 'http://mern-backend:5000',
=======
      "/api": {
        target: "http://localhost:5000",
>>>>>>> 52fbe87 (Complete Lab 04 Docker Hub Multi-Container)
        changeOrigin: true,
      },
    },
  },
});