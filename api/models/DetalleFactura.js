// models/DetalleFactura.js

class DetalleFactura {
    constructor(fastify) {
      this.knex = fastify.knex;
    }
  
    async obtenerPorId(id) {
      return await this.knex("detalles_facturas").where("id", id).first();
    }
  
    async crear(detalleData) {
      const [id] = await this.knex("detalles_facturas").insert(detalleData).returning("id");
      return this.obtenerPorId(id);
    }
  
    async actualizar(id, detalleData) {
      await this.knex("detalles_facturas").where("id", id).update(detalleData);
      return this.obtenerPorId(id);
    }
  
    async eliminar(id) {
      await this.knex("detalles_facturas").where("id", id).del();
    }
  
    async obtenerPorFacturaId(facturaId) {
      return await this.knex("detalles_facturas").where("factura_id", facturaId).select("*");
    }
  }
  
  export default DetalleFactura;