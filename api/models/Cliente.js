// models/Cliente.js

class Cliente {
  constructor(fastify) {
    this.knex = fastify.knex; // Accedemos a la instancia de Knex desde Fastify
  }

  async obtenerTodos() {
    const alClientes = this.knex("clientes").select("*");
    return alClientes;
  }

  async buscarPorCedula(cedula) {
    const cliente = await this.knex("clientes").where("cedula","like", `%${cedula}%`);
    return cliente;
  }
  async obtenerPorId(id) {
    const cliente = await this.knex("clientes").where("id", id).first();
    return cliente;
  }

  async agregarCliente(cliente) {
    try {
      // Insertar el cliente y obtener el ID insertado
      const resultadoDB = await this.knex("clientes").insert(cliente);
      const id = resultadoDB[0]; // El ID está en la primera posición del array
  

      // Devolver el cliente insertado por su ID
      const clienteInsertado = await this.obtenerPorId(id);
      return clienteInsertado;
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      throw error;
    }
  }
  
}

export default Cliente;
