import Producto from "../models/Producto.js";

export default (fastify) => ({
  allProductos: async (request, reply) => {
    const modelProducto = new Producto(fastify);
    const products = await modelProducto.obtenerTodos();
    return reply.send(products);
  },
  addProductosFrom: async (request, reply) => {
    // valirdar el body para ver si nos estn pasando un objeto de elmentos de productos
    if (!request.body || typeof request.body !== "object") {
      return reply.status(400).send({ error: "Body no válido" });
    }
    return "Requiero un archivo de datos";
  },
});
