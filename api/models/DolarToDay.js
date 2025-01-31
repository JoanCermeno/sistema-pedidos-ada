// dolar_today

class DolarToday {
  constructor(fastify) {
    this.fastify = fastify;
    this.table = "dolar_today"; 
  }

  async getDolarToday(fecha) {
    const { db } = this.fastify;
    const result = await db.select().from(this.table).where({ fecha });
    return result;
  }

  async addDolarToday(fecha, tasa) {
    const { db } = this.fastify;
    const result = await db
      .insert({ fecha, tasa })
      .into(this.table)
      .returning("*");
    return result;
  } 
}

export default DolarToday;  