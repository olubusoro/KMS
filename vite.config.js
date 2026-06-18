import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Allows your backend to talk to your frontend, even across different ports
    proxy: {
      // any request starting with /api will be forwarded to the backend
      "/api": {
        target: "https://kms-backend-49bd.onrender.com/", 
        changeOrigin: true, 
        secure: false, // set to false if your backend uses http
      },
    },
  },
});
