// models/Cliente.js

class Cliente {
  constructor(fastify) {
    this.knex = fastify.knex; // Accedemos a la instancia de Knex desde Fastify
  }

  async obtenerTodos() {
    const alClientes = this.knex("clientes").select("*");
    return alClientes;
  }
}

export default Cliente;
