import jwt from "jsonwebtoken"; // Importamos JSON Web Token
import userControllers from "../controllers/user.js";
import clienteController from "../controllers/cliente.js";
import pedidoController from "../controllers/pedido.js";
import productoCOntroller from "../controllers/producto.js";
import helloController from "../controllers/hello.js";
import Test from "../models/Test.js";
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

  //ojo muy importante pasamos el objeto fastify a todos los controladores y depues si extraemos las funciones
  const { autenticarUsuario, addUser } = userControllers(fastify);
  const { obtenerClientes } = clienteController(fastify);
  const { obtenerPedidos } = pedidoController(fastify);
  const {
    allProductos,
    addProductosFrom,
    addProducto,
    editProducto,
    deleteProducto,
  } = productoCOntroller(fastify);
  const { hi } = helloController(fastify);

  //rutas
  fastify.get("/", hi);

  //auth
  fastify.post("/auth", autenticarUsuario);

  fastify.post("/usuario", addUser);

  //producto
  fastify.get("/productos", { preHandler: authMiddleware }, allProductos);

  // AGREGAR VARIOS PRODUCTOS DE UNA SOLA VEZ
  fastify.post("/productos", { preHandler: authMiddleware }, addProductosFrom);
  //AGREGAR UN SOLO PRODUCTO
  fastify.post("/producto", { preHandler: authMiddleware }, addProducto);
  fastify.put("/producto", { preHandler: authMiddleware }, editProducto);
  fastify.delete(
    "/productos/:id",
    { preHandler: authMiddleware },
    deleteProducto
  );

  //clientes
  fastify.get("/cliente", { preHandler: authMiddleware }, obtenerClientes);

  //pedidos
  fastify.get("/pedido", { preHandler: authMiddleware }, obtenerPedidos);

  // prueba
  fastify.get("/clientesOf", async (request, reply) => {
    const clientesModelTest = new Test(fastify);
    const id = request.query.id;
    const alldata = await clientesModelTest.getClientesOfmaster(id);

    console.log(id);
    reply.send(alldata);
  });
  fastify.post("/clientesOf", async (request, reply) => {
    const listaPersonasToSave = request.body;
    const updateRegister = new Test(fastify);
    console.log(listaPersonasToSave);
    const result = await updateRegister.guardarClientes(listaPersonasToSave);
    console.log(result);
    reply.send(listaPersonasToSave);
  });
}

export default routes;
