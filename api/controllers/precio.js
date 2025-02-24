import DolarToday from "../models/DolarToDay.js";
/** funcion para actualizar el precio del día de hoy */
export default (fastify) => ({
  actualizarPrecio: async (request, reply) => {
    // recibir el precio del día de hoy
    const { precio, today } = request.body;

    // validamos que sea un día válido
    if (!today.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return reply.status(400).send({ message: "Fecha no válida" });
    }

    //guardar el precio en la tabla dolar_today
    const dolarToday = new DolarToday(fastify);
    try {
      const resultadoActualizacion = await dolarToday.addDolarToday(
        today,
        precio
      );
      console.log("Tasa del dolar actualizada");
      reply.send({ success: true, message: "Precio actualizado" });
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  },

  obtenerPrecio: async (request, reply) => {
    // Buscamos el ultimo update del precio del dolar
    const ultimaActualizacion = new DolarToday(fastify);
    try {
      const tasa = await ultimaActualizacion.getDolarToday();
      console.log("Precios actualizados con éxito");
      reply.send(tasa);
    } catch (error) {
      throw new Error(error);
    }
  },
});
