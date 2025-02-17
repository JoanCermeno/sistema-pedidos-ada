import Producto from "../models/Producto.js";
import DolarToday from "../models/DolarToDay.js";


export default (fastify) => ({
  allProductos: async (request, reply) => {
    // Instanciamos un objeto del modelo Producto (inicial - solo para usar obtenerTodos)
    const misProductosModelo = new Producto(fastify);
    // Instanciamos un objeto del modelo DolarToday (para obtener la tasa de cambio del dólar)
    const dolarTodayModelo = new DolarToday(fastify);
    // Incluye el parámetro search Y paginado
    const { page = 1, limit = 20, search = null } = request.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const safeLimit = isNaN(limitNum) ? 20 : limitNum;
    const safePage = isNaN(pageNum) ? 1 : pageNum;
    const offset = (safePage - 1) * safeLimit;
    try {
         // 1. Obtener la lista de productos **CRUDOS** desde la base de datos
      const productosDesdeDB = await misProductosModelo.obtenerTodos(
        limit,
        offset,
        page,
        search
      );
      // 2. Obtener la tasa de cambio del dólar **UNA VEZ** para usarla en todos los productos
      const dolarToday = await dolarTodayModelo.getDolarToday();
      const tasaDolarHoy = dolarToday.tasa;
       // 3. Mapear la lista de productos **CRUDOS** a una lista de instancias del modelo `Producto` y calcular precios en Bs
       const productosParaCliente = productosDesdeDB.productosPaginados.map(productoData => {
        // a. Crear una instancia del modelo Producto para **CADA** producto en la lista
        const productoInstancia = new Producto(
            fastify,
            productoData.nombre,
            productoData.descripcion,
            productoData.precio_compra,
            productoData.precio_mayorista,
            productoData.precio_minorista,
            productoData.precio_libre,
            productoData.stock,
            productoData.codigo_barra
        );

        // b. Establecer la tasa de cambio del dólar en **CADA** instancia de Producto
        productoInstancia.setTasaDolar(tasaDolarHoy);

        // c. Construir el objeto JSON para **CADA** producto, incluyendo los precios en Bs
        return {
            id: productoData.id,
            codigo_barra: productoInstancia.codigo_barra,
            nombre: productoInstancia.nombre,
            descripcion: productoInstancia.descripcion,
            precio_compra: productoInstancia.precio_compra,
            precio_mayorista: productoInstancia.precio_mayorista,
            precio_minorista: productoInstancia.precio_minorista,
            precio_libre: productoInstancia.precio_libre,
            stock: productoInstancia.stock,
            precio_mayorista_bs: productoInstancia.getPrecioMayoristaBs(),
            precio_minorista_bs: productoInstancia.getPrecioMinoristaBs(),
            precio_libre_bs: productoInstancia.getPrecioLibreBs(),
            precio_compra_bs: productoInstancia.getPrecioCompraBs(), // Opcional
            created_at: productoData.created_at,
            updated_at: productoData.updated_at,
        };
    });

    // 4.  Construir la respuesta final que incluye:
        //     - La lista de productos **transformados** (`productosParaCliente`)
        //     - La información de paginación (`total`, `page`, `limit`)
        const respuestaFinal = {
          allProductos: productosParaCliente, // Usamos la lista de productos transformados
          total: productosDesdeDB.total,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
      };

      return respuestaFinal; // 5. Retornar la respuesta final

    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: "Error obteniendo los productos" });
    }
  },
  getProductoById: async (request, reply) => {
    const productoId = request.params.id;
    // Instanciamos un objeto del modelo producto (¡OJO! Inicialmente solo con Fastify)
    const modelProducto = new Producto(fastify); // Inicializar solo con 'fastify'

    try {
      const productoDataFromDB = await modelProducto.obtenerProducto(productoId); // Obtener datos de DB
      if (!productoDataFromDB) {
        return reply.status(404).send({ error: "Producto no encontrado" });
      }

      // 2. Crear una instancia del modelo Producto **NUEVAMENTE**, ahora con los datos de la DB
      const productoInstancia = new Producto( // <- Creamos **OTRA** instancia, pero ahora con datos
        fastify,
        productoDataFromDB.nombre,
        productoDataFromDB.descripcion,
        productoDataFromDB.precio_compra,
        productoDataFromDB.precio_mayorista,
        productoDataFromDB.precio_minorista,
        productoDataFromDB.precio_libre,
        productoDataFromDB.stock,
        productoDataFromDB.codigo_barra
      );

      // 3. **¡IMPORTANTE!** Establecer la tasa de cambio del dólar en **esta nueva instancia**
      const DolarModel = new DolarToday(fastify);
      const ultimaActualizacion = await DolarModel.getDolarToday(); // <-- Obtener tasa actual 
      productoInstancia.setTasaDolar(ultimaActualizacion.tasa);

      // 4. Construir el JSON de respuesta, usando la **instancia recién creada** y sus métodos
      const productoJSON = {
        id: productoDataFromDB.id,
        codigo_barra: productoInstancia.codigo_barra, // Usamos propiedades de la instancia
        nombre: productoInstancia.nombre,           // Usamos propiedades de la instancia
        descripcion: productoInstancia.descripcion,     // Usamos propiedades de la instancia
        precio_compra: productoInstancia.precio_compra, // Usamos propiedades de la instancia
        precio_mayorista: productoInstancia.precio_mayorista, // Usamos propiedades de la instancia
        precio_minorista: productoInstancia.precio_minorista, // Usamos propiedades de la instancia
        precio_libre: productoInstancia.precio_libre,     // Usamos propiedades de la instancia
        stock: productoInstancia.stock,               // Usamos propiedades de la instancia
        precio_mayorista_bs: productoInstancia.getPrecioMayoristaBs(), // ¡Precios en Bs desde los métodos!
        precio_minorista_bs: productoInstancia.getPrecioMinoristaBs(), // ¡Precios en Bs desde los métodos!
        precio_libre_bs: productoInstancia.getPrecioLibreBs(),         // ¡Precios en Bs desde los métodos!
        precio_compra_bs: productoInstancia.getPrecioCompraBs(),         // ¡Precios en Bs desde los métodos!
        created_at: productoDataFromDB.created_at,   // Datos de la DB (timestamps)
        updated_at: productoDataFromDB.updated_at,   // Datos de la DB (timestamps)
      };

      reply.send(productoJSON); // 5. Enviar el JSON construido

    } catch (error) {
      console.log(error);
      reply.status(500).send({ error: "Error obteniendo el producto" });
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
      reply.status(500).send({ message: error });
    }
  },
  addProducto: async (request, reply) => {
    const modelProducto = new Producto(fastify);
    try {
      // 1. Extraer los datos del request.body, incluyendo los nuevos precios
      const {
        codigoBarras,
        descripcion,
        nombre,
        precio_compra, // Nuevo campo
        precio_mayorista, // Nuevo campo
        precio_minorista, // Nuevo campo
        precio_libre,   // Nuevo campo
        stock
      } = request.body;

      fastify.log.info(request.body);

      // 2. Validar campos requeridos (ejemplo: nombre, descripcion, precio_compra, precio_minorista)
      if (!nombre || !descripcion || !precio_compra || !precio_minorista) {
        fastify.log.error("no es valido - Campos requeridos");
        throw new Error("Campos requeridos: nombre, descripcion, precio_compra, precio_minorista");
      }

      // 3. Construir el objeto 'nuevoProducto' con **todos** los campos, incluidos los nuevos precios
      const nuevoProductoData = { // Renombramos a nuevoProductoData para claridad
        codigo_barra: codigoBarras || "", // Permitir que sea opcional
        nombre,
        descripcion,
        precio_compra: parseFloat(precio_compra), // Asegurarse de que sea un número
        precio_mayorista: parseFloat(precio_mayorista) || 0, // Asegurarse de que sea un número o 0 por defecto (opcional)
        precio_minorista: parseFloat(precio_minorista), // Asegurarse de que sea un número
        precio_libre: parseFloat(precio_libre) || 0,     // Asegurarse de que sea un número o 0 por defecto (opcional)
        stock: parseInt(stock, 10) || 0, // Asegurarse de que sea un entero (opcional depues se puede meter cantidad)
      };


       // 4. Instanciar el modelo Producto **CON TODOS LOS DATOS**, aunque no se usen directamente aquí para cálculo en Bs
       const productoInstancia = new Producto( // Creamos instancia con TODOS los datos
        fastify,
        nuevoProductoData.nombre,
        nuevoProductoData.descripcion,
        nuevoProductoData.precio_compra,
        nuevoProductoData.precio_mayorista,
        nuevoProductoData.precio_minorista,
        nuevoProductoData.precio_libre,
        nuevoProductoData.stock,
        nuevoProductoData.codigo_barra
      );


      const productoAdded = await modelProducto.addPorducto(nuevoProductoData); // Pasamos *nuevoProductoData* al modelo
      fastify.log.info(productoAdded);
      // 5. Retornar la respuesta exitosa
      return reply.status(201).send(productoAdded); // Retornar el producto agregado
    } catch (error) {
      return reply
        .status(500)
        .send({ error: error.message });
    }
  },

  editProducto: async (request, reply) => {
    // 1. Extraer todos los campos del request.body, incluyendo los nuevos precios
    const id = request.params.id
    const {
      nombre,
      descripcion,
      codigoBarras,
      stock,
      precio_compra,     // Nuevo campo
      precio_mayorista, // Nuevo campo
      precio_minorista, // Nuevo campo
      precio_libre,     // Nuevo campo
      precio_bs         // Lo mantenemos para ejemplo, pero podrías quitarlo si no lo usas directo
    } = request.body;

    const camposAActualizar = {};

    if (nombre !== undefined) camposAActualizar.nombre = nombre;
    if (descripcion !== undefined) camposAActualizar.descripcion = descripcion;
    if (codigoBarras !== undefined) camposAActualizar.codigo_barra = codigoBarras; // Corregido a codigo_barra
    if (stock !== undefined) camposAActualizar.stock = stock;
    if (precio_compra !== undefined) camposAActualizar.precio_compra = precio_compra; // Nuevo campo
    if (precio_mayorista !== undefined) camposAActualizar.precio_mayorista = precio_mayorista; // Nuevo campo
    if (precio_minorista !== undefined) camposAActualizar.precio_minorista = precio_minorista; // Nuevo campo
    if (precio_libre !== undefined) camposAActualizar.precio_libre = precio_libre;     // Nuevo campo
    if(precio_bs !== undefined) camposAActualizar.precio_bs = precio_bs; // Lo mantenemos como ejemplo

    if (Object.keys(camposAActualizar).length === 0) {
      return reply
        .code(400)
        .send({ error: "No se enviaron campos para actualizar" });
    }

    const modelProducto = new Producto(fastify);
    console.log("campos a actualizar: ", camposAActualizar);

    try {
      const resultadoActualizacion = await modelProducto.actualiza(
        camposAActualizar,
        id
      );
      reply.code(200).send({message: "Producto actualizado correctamente", updatedRows: resultadoActualizacion}); // Respuesta más informativa
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({
        message: "Ocurrio un error al intentar actualizar este producto",
      });
    }
  },
  deleteProducto: async (request, reply) => {
    const id = request.params.id
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
