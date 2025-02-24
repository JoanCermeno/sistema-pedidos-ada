// models/Producto.js

class Producto {
  constructor(
    fastify,
    nombre,
    descripcion,
    precio_compra,
    precio_mayorista,
    precio_minorista,
    precio_libre,
    stock,
    codigo_barra
  ) {
    this.knex = fastify.knex; // Accedemos a la instancia de Knex desde Fastify
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio_compra = precio_compra;
    this.precio_mayorista = precio_mayorista;
    this.precio_minorista = precio_minorista;
    this.precio_libre = precio_libre;
    this.stock = stock;
    this.codigo_barra = codigo_barra;
    this.tasaDolarActual = 0; // Inicialmente, la tasa es 0 o se podría obtener de alguna configuración inicial
  }

  async obtenerTodos(limit, offset, page, search) {
    const query = this.knex("productos")
      .select("*")
      .limit(limit)
      .offset(offset);

    if (search) {
      query.where((builder) => {
        builder
          .where("nombre", "like", `%${search}%`)
          .orWhere("codigo_barra", "like", `%${search}%`);
      });
    }

    const productosPaginados = await query;
    const totalQuery = this.knex("productos").count("* as count");

    if (search) {
      totalQuery.where((builder) => {
        builder
          .where("nombre", "like", `%${search}%`)
          .orWhere("codigo_barra", "like", `%${search}%`);
      });
    }

    const total = await totalQuery.first();

    return {
      productosPaginados,
      total: total.count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
  }
  async obtenerProducto(id, token) {
    try {
      const producto = await this.knex("productos")
        .select("*")
        .where({ id })
        .first();
      return producto;
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      throw error;
    }
  }

  async registrarAuditoria(auditoria) {
    // **Función para registrar auditoría**
    try {
      const resultado = await this.knex("productos_audit").insert(auditoria);
      return resultado;
    } catch (error) {
      console.error("Error al registrar auditoría del producto:", error);
      throw error;
    }
  }

  async addListOfProduct(listaProducto) {
    try {
      // 1. Iniciar una transacción
      await this.knex.transaction(async (trx) => {
        // 2. Insertar todos los productos dentro de la transacción
        for (const producto of listaProducto) {
          await trx("productos").insert({
            //**Del lado izquierdo de la tabla productos del lado derecho campos del archivo de datos**//
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio_minorista: producto.precio,
          });
        }
      });

      // 3. Retornar éxito
      return "Productos importados con éxito";
    } catch (error) {
      console.error("Error guardando productos:", error);
      throw new Error({
        success: false,
        message: "Error al importar productos",
      });
    }
  }

  async addPorducto(nuevoProducto) {
    try {
        const resultInsertInDB = await this.knex("productos").insert(
            nuevoProducto
        );
        const productoAgregado = await this.knex("productos")
            .select("*")
            .where({ id: resultInsertInDB[0] })
            .first();
        return productoAgregado; // Retornar solo el producto agregado
    } catch (error) {
        console.error("Error al agregar producto:", error); // Mensaje de error simplificado
        throw error;
    }
}

  async actualiza(camposAActualizar, id) {
    try {
      const resultado = await this.knex("productos")
        .where({ id })
        .update(camposAActualizar);
      return resultado; // Retornar solo el resultado del UPDATE (filas afectadas)
    } catch (error) {
      console.error("Error al actualizar producto:", error); // Mensaje de error simplificado
      throw error;
    }
  }
  async borrar(id) {
    try {
      const resultado = await this.knex("productos").where({ id }).del();
      return resultado;
    } catch (error) {
      console.error("Error al borrar producto:", error); // Mensaje de error simplificado
      throw error;
    }
  }
  // Método para establecer la tasa de cambio del dólar (deberías actualizarla periódicamente)
  setTasaDolar(tasa) {
    this.tasaDolarActual = tasa;
  }

  getPrecioMayoristaBs() {
    return parseFloat(
      (this.precio_mayorista * this.tasaDolarActual).toFixed(2)
    );
  }

  getPrecioMinoristaBs() {
    return parseFloat(
      (this.precio_minorista * this.tasaDolarActual).toFixed(2)
    );
  }

  getPrecioLibreBs() {
    return parseFloat((this.precio_libre * this.tasaDolarActual).toFixed(2));
  }

  getPrecioCompraBs() {
    // Opcional, si también quieres precio de compra en Bs
    return parseFloat((this.precio_compra * this.tasaDolarActual).toFixed(2));
  }
}

export default Producto;
