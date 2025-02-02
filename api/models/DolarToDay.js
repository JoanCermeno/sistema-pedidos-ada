// dolar_today

class DolarToday {
  constructor(fastify) {
    this.knex = fastify.knex; // Accedemos a la instancia de Knex desde Fastify
    this.table = "dolar_today"; 
  }

  async getDolarToday() {
    try {
    //obtener el ultimo update del precio del dolar
    const ultimaActualizacion = await this.knex('dolar_today')
    .select('*')
    .orderBy('created_at', 'desc')
    .first();


      if(!ultimaActualizacion){
        return { tasa: 1, fecha: "No hay actualizacion del precio del dolar" };
      }

      //formateando la fecha
      if(ultimaActualizacion.tasa === 1){
        return { tasa: 1, fecha: "No hay actualizacion del precio del dolar" };
      }
      const fecha = new Date(ultimaActualizacion.fecha);
      const day = fecha.getDate();
      const month = fecha.getMonth() + 1;
      const year = fecha.getFullYear();
      const ultimaActualizacionFormateada = `${day}-${month}-${year}`;
      return { tasa: ultimaActualizacion.tasa, fecha: ultimaActualizacionFormateada };
      
    } catch (error) {
      console.log(error);
    }



  }

  async addDolarToday(fecha, tasa) {
    try {
      const insertTasaDolar = await this.knex('dolar_today')
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