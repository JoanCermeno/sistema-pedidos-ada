import Fastify from "fastify";
import Router from "./routes/index.js";
import knexPlugin from "./plugin/knex.js";
import knexfile from "./knexfile.js"; // Tu configuración de Knex
import envPlugin from "@fastify/env";
import cors from "@fastify/cors";

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

const fastify = Fastify({
  logger: true,
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
    await fastify.listen({ port: fastify.config.PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
