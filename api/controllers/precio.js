import DolarToday from "../models/DolarToDay.js";

export default (fastify) => ({
  actualizarPrecio: async (request, reply) => {
    // recibir el precio del día de hoy
    const { precio, today } = request.body;
    console.log(precio);
    console.log(today);
    // bien ahora validamos que el precio sea un número
    if (!precio.match(/^\d+$/)) {
      return reply.status(400).send({ message: "Precio no válido" });
    }
    // validamos que sea un día válido
    if (!today.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return reply.status(400).send({ message: "Fecha no válida" });
    }

    //guardar el precio en la tabla dolar_today
    const dolarToday = new DolarToday(fastify);
    try {
      await dolarToday.addDolarToday(today, precio);

      reply.send({ message: "Precio actualizado" });
    } catch (error) {
      reply.status(500).send({ message: "Error al actualizar el precio" });
    }
  },
});
