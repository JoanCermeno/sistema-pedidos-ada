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
});
