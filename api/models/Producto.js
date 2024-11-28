// models/Producto.js

class Producto {
  constructor(fastify) {
    this.knex = fastify.knex; // Accedemos a la instancia de Knex desde Fastify
  }

  async obtenerTodos(limit, offset, page) {
    const allProductos = await this.knex("productos")
      .select("*")
      .limit(limit)
      .offset(offset);

    const total = await this.knex("productos").count("* as count").first();
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
}

export default Producto;
