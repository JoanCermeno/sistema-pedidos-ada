import Venta from "../models/Venta.js";

export default (fastify) => ({
  allVentas: async (request, reply) => {
    const ventaModel = new Venta(fastify);
    const { page = 1, limit = 20, search = null } = request.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const safeLimit = isNaN(limitNum) ? 20 : limitNum;
    const safePage = isNaN(pageNum) ? 1 : pageNum;

    const offset = (safePage - 1) * safeLimit;

    try {
      const result = await ventaModel.getVentas(limit,
        offset,
        page,
        search);
      return {
        ventas: result.ventas, // Array de ventas paginado
        totalVentas: result.totalVentas, // Total de ventas sin paginar
        paginaActual: safePage, // Página actual
        limit: safeLimit // Límite por página
      };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: "Error obteniendo las ventas" });
    }
  },
  addVenta: async (request, reply) => {
    const ventaModel = new Venta(fastify);
    const ventaData = request.body;
    //console.log(ventaData);

    try {
      // Validación básica
      if (!ventaData.total || !ventaData.detalles || !Array.isArray(ventaData.detalles)) {
        return reply.status(400).send({
          error: "Datos incompletos: Se requiere total y array de detalles"
        });
      }

      // Validar detalles
      const detallesValidos = ventaData.detalles.every(detalle => 
        detalle.producto_id &&
        detalle.cantidad > 0 &&
        detalle.precio > 0 &&
        detalle.precio_bs > 0 &&
        detalle.subtotal > 0
      );


      if (!detallesValidos) {
        return reply.status(400).send({
          error: "Detalles inválidos: Cada detalle debe tener producto_id, cantidad, precio, precio_bs y subtotal válidos"
        });
      }

      // Insertar venta con transacción
      const ventaId = await ventaModel.addVenta(ventaData);
      
      return reply.status(201).send({
        id: ventaId,
        message: "Venta registrada exitosamente"
      });

    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        error: error.message || "Error al registrar la venta"
      });
    }
  },

  // Método adicional para ejemplo de eliminación
  deleteVenta: async (request, reply) => {
    const { id } = request.params;
    const ventaModel = new Venta(fastify);
    
    try {
      // Necesitarías implementar este método en el modelo
      const resultado = await ventaModel.borrar(id);
      return reply.code(200).send(resultado);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        error: "Error eliminando la venta"
      });
    }
  }
});