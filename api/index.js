import Fastify from "fastify";
import Router from "./routes/index.js";
import knexPlugin from "./plugin/knex.js";
import knexfile from "./knexfile.js"; // Tu configuración de Knex
import envPlugin from "@fastify/env";
import cors from "@fastify/cors";
import fs from "fs";

// variables de entorno
const schema = {
  type: "object",
  required: ["JWT_SECRET", "PORT"],
  properties: {
    PORT: { type: "integer", default: 3000 },
    JWT_SECRET: { type: "string" },
  },
};

const options = {
  dotenv: true, // Habilita la lectura automática de archivos .env
  schema, // Esquema de validación
};

// Leer los certificados
const httpsOptions = {
  key: fs.readFileSync("./../certs/localhost+3-key.pem"),
  cert: fs.readFileSync("./../certs/localhost+3.pem"),
};

// Crear el servidor con HTTPS
const fastify = Fastify({
  logger: true,
  https: httpsOptions,
});

//cors
await fastify.register(cors, {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
});

await fastify.register(envPlugin, options);
fastify.register(knexPlugin, knexfile); // Pasa la configuración de Knex
fastify.register(Router);

const start = async () => {
  try {
    await fastify.listen({ port: fastify.config.PORT, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
