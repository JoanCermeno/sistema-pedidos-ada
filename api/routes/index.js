import jwt from "jsonwebtoken"; // Importamos JSON Web Token
import Producto from "../models/Producto.js";
import Cliente from "../models/Cliente.js";
import Pedido from "../models/Pedido.js";
import User from "../models/Usuario.js";

async function routes(fastify, options) {
  //middelwares para proteger las rutas
  async function authMiddleware(request, reply) {
    try {
      const token = request.headers["authorization"].split(" ")[1]; // Asumiendo que el token está en el encabezado Authorization

      console.log(token);

      if (!token) {
        throw new Error("Token no proporcionado");
      }

      const decoded = jwt.verify(token, fastify.config.JWT_SECRET);

      request.user = decoded; // Almacenamos los datos del usuario en la solicitud

      console.log(decoded);
      return decoded;
    } catch (error) {
      console.log(error);
      reply.status(401).send({ message: "Token inválido o expirado" });

      throw new Error(error);
    }
  }

  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  //auth
  fastify.post("/auth", async (request, reply) => {
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
      reply.status(401).send({ message: error.message });
    }
  });

  fastify.post("/usuario", async (request, reply) => {
    const { user, pass } = request.body;
    const modeloUser = new User(fastify);
    const resultado = await modeloUser.addUser(user, pass);
    if (resultado == 1) {
      console.log("Esrror al guardar");
      reply.send("error al guardar el suaurio");
    } else {
      reply.send("LISTO USUARIO AGREGADO");
    }
  });
  //producto
  fastify.get(
    "/producto",
    { preHandler: authMiddleware },
    async (request, reply) => {
      const modelProducto = new Producto(fastify);
      const products = await modelProducto.obtenerTodos();
      return reply.send(products);
    }
  );

  //clientes
  fastify.get(
    "/cliente",
    { preHandler: authMiddleware },
    async (request, reply) => {
      const modelCliente = new Cliente(fastify);
      const clientes = await modelCliente.obtenerTodos();
      return reply.send(clientes);
    }
  );

  //pedidos
  fastify.get(
    "/pedido",
    { preHandler: authMiddleware },
    async (request, reply) => {
      const modelPedido = new Pedido(fastify);
      const pedidos = await modelPedido.obtenerTodos();
      return reply.send(pedidos);
    }
  );

  // Ruta protegida
  fastify.get(
    "/protected-route",
    { preHandler: authMiddleware },
    async (request, reply) => {
      // Si llegamos aquí, el token es válido y el usuario está autenticado
      reply.send({ message: "Acceso autorizado", user: request.user });
    }
  );
}

//ESM
export default routes;
