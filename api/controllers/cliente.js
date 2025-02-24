import Cliente from "../models/Cliente.js";

export default (fastify) => ({
  obtenerClientes: async (_request, reply) => {
    const modelCliente = new Cliente(fastify);

    try {
      const clientes = await modelCliente.obtenerTodos();
      reply.send(clientes);
    } catch (error) {
      reply.status(500).send({ message: "Error al obtener los clientes" });
    }
  },

  buscarPorCedula: async (request, reply) => {
    const { cedula } = request.params;
    const modelCliente = new Cliente(fastify);

    try {
      const cliente = await modelCliente.buscarPorCedula(cedula);
      if (!cliente) {
        return reply.status(404).send({ message: "Cliente no encontrado" });
      }
      reply.send(cliente);
    } catch (error) {
      reply.status(500).send({ message: "Error al buscar cliente" });
    }
  }, 
  
  agregarCliente: async (request, reply) => {
    const cliente = request.body;
    const modelCliente = new Cliente(fastify);

    try {
      const clienteAgregado = await modelCliente.agregarCliente(cliente);
      reply.send(clienteAgregado);
    } catch (error) {
      reply.status(500).send({ message: "Error al agregar cliente" });
    }
  },
});
