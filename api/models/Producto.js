// models/Producto.js

class Producto {
  constructor(fastify) {
    this.knex = fastify.knex; // Accedemos a la instancia de Knex desde Fastify
  }

  async obtenerTodos() {
    const allProductos = this.knex("productos").select("*");
    return allProductos;
  }
}

export default Producto;
