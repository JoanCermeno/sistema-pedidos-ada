import Pedido from "../models/Pedido.js";

export default (fastify) => ({
  obtenerPedidos: async (_request, reply) => {
    const modelPedido = new Pedido(fastify);
    const pedidos = await modelPedido.obtenerTodos();
    return reply.send(pedidos);
  },
});
