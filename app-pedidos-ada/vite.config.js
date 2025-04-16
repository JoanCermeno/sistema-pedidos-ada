import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  server: {
    // ... otras configuraciones de servidor
    allowedHosts: true,
  },
  plugins: [react(), tailwindcss()],
});
