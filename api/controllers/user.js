import User from "../models/Usuario.js";
import jwt from "jsonwebtoken";

export default (fastify) => ({
  autenticarUsuario: async (request, reply) => {
    // Validar que el body esté presente y sea un objeto
    if (!request.body || typeof request.body !== "object") {
      return reply.status(400).send({ error: "Body no válido" });
    }
    const { user, pass } = request.body;
    const modeloUser = new User(fastify);
    try {
      // 1. Autenticamos al usuario con las credenciales
      const usuario = await modeloUser.authUser(user, pass);

      // 2. Crear un token JWT
      const token = jwt.sign(
        { id: usuario.id, username: usuario.nombre },
        fastify.config.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // 3. Enviar el token al cliente
      reply.send({ message: "Autenticación exitosa", token });
    } catch (error) {
      fastify.log.error(error);
      reply.status(401).send({ message: error.message });
    }
  },

  addUser: async (request, reply) => {
    const { user, pass } = request.body;
    const modeloUser = new User(fastify);

    try {
      const resultado = await modeloUser.addUser(user, pass);
      if (resultado === 1) {
        console.log("Error al guardar");
        reply.send("Error al guardar el usuario");
      } else {
        reply.send("Usuario agregado exitosamente");
      }
    } catch (error) {
      reply.status(500).send({ message: "Error interno al agregar usuario" });
    }
  },
});
