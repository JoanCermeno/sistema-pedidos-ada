export default (fastify) => ({
  hi: async (request, reply) => {
    return { hello: "world" };
  },
  bye: async (request, reply) => {
    return { hello: "bye" };
  },
});
