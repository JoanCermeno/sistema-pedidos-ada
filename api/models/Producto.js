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
    return listaProducto;
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
      console.log(error);
      return error;
    }
  }
}

export default Producto;
