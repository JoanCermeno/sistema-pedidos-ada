// models/Pedido.js

class Pedido {
  constructor(fastify) {
    this.knex = fastify.knex; // Accedemos a la instancia de Knex desde Fastify
  }

  async obtenerTodos() {
    const allPedido = this.knex("pedidos").select("*");
    return allPedido;
  }
}

export default Pedido;
