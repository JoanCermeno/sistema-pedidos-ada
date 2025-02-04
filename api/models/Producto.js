// models/Producto.js

class Producto {
  constructor(fastify) {
    this.knex = fastify.knex; // Accedemos a la instancia de Knex desde Fastify
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

    const allProductos = await query;
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
      allProductos,
      total: total.count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };
  }

  async addListOfProduct(listaProducto) {
    try {
      // 1. Iniciar una transacción
      await this.knex.transaction(async (trx) => {
        // 2. Insertar todos los productos dentro de la transacción
        for (const producto of listaProducto) {
          await trx("productos").insert({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
          });
        }
      });
  
      // 3. Retornar éxito
      return "Productos importados con éxito";
    } catch (error) {
      console.error("Error guardando productos:", error);
      return "Error al importar productos";
    }
  }

  async addPorducto(nuevoProducto) {
    try {
      // sresultInserIN es el id del producto recien creado
      const resultInsertInDB = await this.knex("productos").insert(
        nuevoProducto
      );

      const productoAgregado = await this.knex("productos")
        .select("*")
        .where({ id: resultInsertInDB[0] })
        .first();
      return productoAgregado;
    } catch (error) {

      throw error;
    }
  }

  async actualiza(camposAActualizar, id) {
    try {
      const resultado = await this.knex("productos")
        .where({ id })
        .update(camposAActualizar);
      return resultado;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async borrar(id) {
    try {
      const resultado = await this.knex("productos").where({ id }).del();
      return resultado;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async actualizarPrecioBs(tasaDolar) {
    //*** actualizar el precio en bolivares de todos los productos, recibo el tasa del dolar del dia que me pases y actualizo los precios en bolivares, devuelve un objeto con un mensaje de error o de éxito
    try {
      console.log("actualizando precios en bolivares...");

      // 1. Obtener todos los productos
      const productos = await this.knex("productos").select(
        "id",
        "precio",
        "precio_bs"
      );


        // 2. Crear un array con los productos actualizados
    const productosActualizados = productos.map((producto) => {
      return {
        id: producto.id,
        precio_bs: parseFloat((producto.precio * tasaDolar).toFixed(2)), // Redondear a 2 decimales
      };
    });
    //console.log(productosActualizados);

     // 3. Usar una transacción para actualizar todos los productos
     await this.knex.transaction(async (trx) => {
      for (const producto of productosActualizados) {
        await trx('productos')
          .where({ id: producto.id })
          .update({ precio_bs: producto.precio_bs });
      }
    });
      
    // 4. Verificar si se ejecutaron correctamente
      return {
        success: true,
        message: "Precios en bolívares actualizados correctamente.",
      };
    } catch (error) {
      console.error("Error al actualizar precios en bolívares:", error);
      return {
        success: false,
        message: "Error al actualizar precios en bolívares.",
      };
    }
  }
}

export default Producto;
