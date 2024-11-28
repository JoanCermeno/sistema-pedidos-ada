import Producto from "../models/Producto.js";

export default (fastify) => ({
  allProductos: async (request, reply) => {
    //Instanciamos un objeto de el modelo producto
    const misProductos = new Producto(fastify);

    const { page = 1, limit = 10 } = request.query; // Página actual y límite por página
    const offset = (page - 1) * limit;

    try {
      const productos = await misProductos.obtenerTodos(limit, offset, page);
      return productos;
    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: "Error obteniendo los productos" });
    }
  },
  addProductosFrom: async (request, reply) => {
    // valirdar el body para ver si nos estn pasando un objeto de elmentos de productos
    if (!request.body || typeof request.body !== "object") {
      return reply.status(400).send({ error: "Body no válido" });
    }
    return "Requiero un archivo de datos";
  },
});
