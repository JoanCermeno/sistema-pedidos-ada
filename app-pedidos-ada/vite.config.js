import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  server: {
    // https: {
    //   key: fs.readFileSync("./../certs/localhost+3-key.pem"),
    //   cert: fs.readFileSync("./../certs/localhost+3.pem"),
    // },
    host: "0.0.0.0", // Para que sea accesible desde otros dispositivos
    port: 5173, // O el puerto que prefieras
  },
  plugins: [react(), tailwindcss()],
});
