// models/CuentaPorCobrar.js

class CuentaPorCobrar {
    constructor(fastify) {
      this.knex = fastify.knex;
    }
  
    async obtenerPorFacturaId(facturaId) {
      return await this.knex("cuentas_por_cobrar").where("factura_id", facturaId).first();
    }
  
    async crear(cuentaPorCobrarData) {
      const [id] = await this.knex("cuentas_por_cobrar").insert(cuentaPorCobrarData).returning("id");
      return this.obtenerPorId(id);
    }
  
    async obtenerPorId(id) {
      return await this.knex("cuentas_por_cobrar").where("id", id).first();
    }
  
  
    async actualizar(id, cuentaPorCobrarData) {
      await this.knex("cuentas_por_cobrar").where("id", id).update(cuentaPorCobrarData);
      return this.obtenerPorId(id);
    }
  
    async eliminar(id) {
      await this.knex("cuentas_por_cobrar").where("id", id).del();
    }
  
    async registrarPago(facturaId, montoPagado) {
      const cuentaPorCobrar = await this.obtenerPorFacturaId(facturaId);
      if (!cuentaPorCobrar) {
        throw new Error("Cuenta por cobrar no encontrada para la factura ID: " + facturaId);
      }
  
      const nuevoSaldoActual = cuentaPorCobrar.saldo_actual - montoPagado;
  
      let nuevoEstadoCuenta = cuentaPorCobrar.estado_cuenta;
      if (nuevoSaldoActual <= 0) {
        nuevoEstadoCuenta = 'pagada';
      } else if (nuevoSaldoActual < cuentaPorCobrar.saldo_inicial) {
        nuevoEstadoCuenta = 'parcialmente_pagada';
      }
  
  
      await this.knex("cuentas_por_cobrar")
        .where("factura_id", facturaId)
        .update({
          saldo_actual: nuevoSaldoActual,
          estado_cuenta: nuevoEstadoCuenta,
          updated_at: new Date() // Actualizar manualmente el timestamp updated_at
        });
  
        // Opcionalmente podrías registrar el historial de pagos en otra tabla 'pagos_cuentas_por_cobrar'
  
      return this.obtenerPorFacturaId(facturaId); // Devolver la cuenta por cobrar actualizada
    }
  }
  
  export default CuentaPorCobrar;