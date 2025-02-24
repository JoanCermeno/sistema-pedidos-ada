// models/Factura.js

class Factura {
    constructor(fastify) {
      this.knex = fastify.knex; // Accedemos a la instancia de Knex desde Fastify
    }
  
    async obtenerTodos() {
      const facturas = await this.knex("facturas").select("*");
      return facturas;
    }
  
    async obtenerPorId(id) {
      const factura = await this.knex("facturas").where("id", id).first();
      return factura;
    }
  
    async obtenerConDetalles(id) {
      const factura = await this.knex("facturas")
        .where("facturas.id", id)
        .select("*") // Selecciona todos los campos de la factura
        .first()
        .then(async factura => {
          if (!factura) {
            return null; // Factura no encontrada
          }
          const detalles = await this.obtenerDetallesFactura(id); // Usamos el método de este modelo
          return { ...factura, detalles_factura: detalles }; // Combinamos factura y detalles
        });
      return factura;
    }
  
  
    async crear(facturaData) {
      await this.knex("facturas").insert(facturaData); // Insertar sin returning() para SQLite
      const [result] = await this.knex.raw('SELECT last_insert_rowid() as id'); // Obtener el último ID insertado en SQLite
      const id = result.id;
      return this.obtenerPorId(id); // Devolver la factura recién creada
  }
  
    async actualizar(id, facturaData) {
      await this.knex("facturas").where("id", id).update(facturaData);
      return this.obtenerPorId(id); // Devolver la factura actualizada
    }
  
    async eliminar(id) {
      await this.knex("facturas").where("id", id).del();
    }
  
  
    // Métodos relacionados con detalles de factura (podrían estar en DetalleFacturaModel también, según prefieras)
    async obtenerDetallesFactura(facturaId) {
      const detalles = await this.knex("detalles_facturas")
        .where("factura_id", facturaId)
        .select("*");
      return detalles;
    }
  
    async agregarDetalleFactura(detalleData) {
      const [id] = await this.knex("detalles_facturas").insert(detalleData).returning("id");
      return this.obtenerDetalleFacturaPorId(id);
    }
  
    async obtenerDetalleFacturaPorId(id) {
      return await this.knex("detalles_facturas").where("id", id).first();
    }
  
    async actualizarDetalleFactura(id, detalleData) {
      await this.knex("detalles_facturas").where("id", id).update(detalleData);
      return this.obtenerDetalleFacturaPorId(id);
    }
  
    async eliminarDetalleFactura(id) {
      await this.knex("detalles_facturas").where("id", id).del();
    }
  
    async eliminarDetallesFacturaPorFacturaId(facturaId) {
      await this.knex("detalles_facturas").where("factura_id", facturaId).del();
    }
  }
  
  export default Factura;