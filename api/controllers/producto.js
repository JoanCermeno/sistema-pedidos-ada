import Producto from "../models/Producto.js";

export default (fastify) => ({
  allProductos: async (request, reply) => {
    // Instanciamos un objeto del modelo producto
    const misProductos = new Producto(fastify);

    const { page = 1, limit = 20, search = null } = request.query; // Incluye el parámetro search

    // Asegúrate de que limit y page sean números enteros
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Si los valores no son válidos, establece los predeterminados
    const safeLimit = isNaN(limitNum) ? 20 : limitNum; // Valor predeterminado de 20
    const safePage = isNaN(pageNum) ? 1 : pageNum;

    const offset = (safePage - 1) * safeLimit;

    try {
      const productos = await misProductos.obtenerTodos(
        limit,
        offset,
        page,
        search
      );
      return productos; // Respuesta con productos filtrados y paginados
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
  addProducto: async (request, reply) => {
    const modelProducto = new Producto(fastify);
    try {
      // Validar si el cuerpo contiene un objeto válido
      const producto = request.body;
      if (!producto || typeof producto !== "object") {
        return reply.status(400).send({ error: "Body no válido" });
      }

      // Validar que los campos requeridos existan
      const { codigoBarras, descripcion, nombre, precio, stock } = producto;
      if (!descripcion || !nombre || !precio || !stock) {
        return reply.status(400).send({
          error: "Campos requeridos: descripcion, nombre, precio, stock",
        });
      }

      // Construyendo el producto a insertar
      const nuevoProducto = {
        codigo_barra: codigoBarras || "", // Permitir que sea opcional
        descripcion,
        nombre,
        precio: parseFloat(precio), // Asegurarse de que el precio sea un número
        stock: parseInt(stock, 10), // Asegurarse de que el stock sea un entero
      };
      const productoAdded = await modelProducto.addPorducto(nuevoProducto);

      // Retornar la respuesta exitosa
      return reply.status(201).send(productoAdded);
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      return reply
        .status(500)
        .send({ error: "Error al agregar el producto en la base de datos" });
    }
  },
});
