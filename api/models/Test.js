class clientesOfMaster {
  constructor(fastify) {
    this.knex = fastify.knex; // Accedemos a la instancia de Knex desde Fastify
  }

  async getClientesOfmaster(id) {
    const allCliente = await this.knex("cliente3")
      .where("fk_user_master", "=", id)
      .select();
    return allCliente;
  }

  async guardarClientes(clientesList) {
    try {
      // Inserta o actualiza los registros según el ID de cliente
      const result = await this.knex("cliente3")
        .insert(clientesList)
        .onConflict("id") // Campo único o primary key
        .merge(); // Actualiza los registros existentes
      console.log("Clientes guardados:", result);
      return result;
    } catch (error) {
      console.error("Error al guardar clientes:", error);
      throw error;
    }
  }
}

export default clientesOfMaster;
