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
    const modelProducto = new Producto(fastify);
    const productos = request.body;

    // Valida que sea un array
    if (!Array.isArray(productos)) {
      return reply
        .status(400)
        .send({ error: "El formato de datos es incorrecto" });
    }

    try {
      const resultado = await modelProducto.addListOfProduct(productos);
      reply.status(201).send({ message: resultado });
    } catch (error) {
      console.log("error al intentar insertar productos desde el arrego");
      reply.status(500).send({ message: resultado });
    }
  },
  addProducto: async (request, reply) => {
    const modelProducto = new Producto(fastify);
    try {
      // Validar que los campos requeridos existan
      const { codigoBarras, descripcion, nombre, precio, precio_bs, stock } = request.body;

      fastify.log.info(request.body);

      if (!descripcion || !nombre || !precio || !stock || !precio_bs) {
        fastify.log.error("no es valido");
        throw new Error("Campos requeridos: descripcion, nombre, precio, precio_bs, stock");
      }

      // Construyendo el producto a insertar
      const nuevoProducto = {
        codigo_barra: codigoBarras || "", // Permitir que sea opcional
        descripcion,
        nombre,
        precio: parseFloat(precio), // Asegurarse de que el precio sea un número
        precio_bs: parseFloat(precio_bs), // Asegurarse de que el precio sea un número
        stock: parseInt(stock, 10), // Asegurarse de que el stock sea un entero
      };


      const productoAdded = await modelProducto.addPorducto(nuevoProducto);
      fastify.log.info(productoAdded);
      // Retornar la respuesta exitosa
      return reply.status(201).send(productoAdded);
    } catch (error) {
      return reply
        .status(500)
        .send({ error: error.message });
    }
  },

  editProducto: async (request, reply) => {
    const { id, nombre, descripcion, precio, precio_bs, codigoBarras, stock } =
      request.body;
    const camposAActualizar = {};
    if (id !== undefined) camposAActualizar.id = id;
    if (nombre !== undefined) camposAActualizar.nombre = nombre;
    if (descripcion !== undefined) camposAActualizar.descripcion = descripcion;
    if (precio !== undefined) camposAActualizar.precio = precio;
    if (codigoBarras !== undefined)
      camposAActualizar.codigoBarras = codigoBarras;
    if (stock !== undefined) camposAActualizar.stock = stock;
    if(precio_bs !== undefined) camposAActualizar.precio_bs = precio_bs; 

    if (Object.keys(camposAActualizar).length === 0) {
      return reply
        .code(400)
        .send({ error: "No se enviaron campos para actualizar" });
    }
    // mandamos a actualizar
    const modelProducto = new Producto(fastify);
    console.log("campos a actualizar: ", camposAActualizar);

    try {
      const resultadoActualizacion = await modelProducto.actualiza(
        camposAActualizar,
        id
      );
      //SI todo ok se manda un 1
      reply.code(200).send(resultadoActualizacion);
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({
        message: "Ocurrio un error al intentar actualizar este producto",
      });
    }
  },
  deleteProducto: async (request, reply) => {
    const { id } = request.params;
    const ModelProducto = new Producto(fastify);
    try {
      const resultado = await ModelProducto.borrar(id);
      return reply.code(200).send(resultado);
    } catch (error) {
      console.log(error);
      return reply.code(500).send(error);
    }
  },
});
