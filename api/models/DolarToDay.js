// dolar_today

class DolarToday {
  constructor(fastify) {
    this.knex = fastify.knex; // Accedemos a la instancia de Knex desde Fastify
    this.table = "dolar_today";
  }

  /**
   * Obtiene la tasa de cambio del dólar y la fecha de la última actualización.
   *
   * @async
   * @returns {Promise<{tasa: number, fecha: string}>} Un objeto que contiene la tasa de cambio y la fecha de actualización.
   *          `tasa`: La tasa de cambio del dólar (number).
   *          `fecha`: La fecha de la última actualización en formato 'dd-mm-aaaa' (string), o "No hay actualizacion del precio del dolar" si no hay datos.
   */
  async getDolarToday() {
    //** Esta funcion retorna la tasa de cambio del dólar, y la fecha de la última actualización en un objeto
    //  */
    try {
      //obtener el ultimo update del precio del dolar
      const ultimaActualizacion = await this.knex("dolar_today")
        .select("*")
        .orderBy("created_at", "desc")
        .first();

      if (!ultimaActualizacion) {
        return { tasa: 1, fecha: "No hay actualizacion del precio del dolar" };
      }

      //formateando la fecha
      if (ultimaActualizacion.tasa === 1) {
        return { tasa: 1, fecha: "No hay actualizacion del precio del dolar" };
      }

      return {
        tasa: ultimaActualizacion.tasa,
        fecha: ultimaActualizacion.fecha,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async addDolarToday(fecha, tasa) {
    try {
      const insertTasaDolar = await this.knex("dolar_today")
        .insert({ fecha, tasa })
        .returning("*");
      return insertTasaDolar[0];
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export default DolarToday;
