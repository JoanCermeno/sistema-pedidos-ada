// controllers/facturasController.js
import Factura from "../models/Factura.js";
import DetalleFactura from "../models/DetalleFactura.js"; // Si separaste el modelo
import CuentaPorCobrar from "../models/CuentaPorCobrar.js";

export default (fastify) => ({
  listarFacturasController: async (request, reply) => {
    const facturaModel = new Factura(fastify);

    try {
      const facturas = await facturaModel.obtenerTodos(); // Usar obtenerTodos o un método más sofisticado con paginación y filtros
      reply.send({ facturas });
    } catch (error) {
      console.error("Error al listar facturas:", error);
      reply
        .status(500)
        .send({ error: "Error al listar facturas", detalles: error.message });
    }
  },

  obtenerDetallesFacturaController: async (request, reply) => {
    const facturaModel = new Factura(fastify);
    const facturaId = request.params.id; // Asume que el ID de la factura viene en los parámetros de la ruta (/facturas/:id)

    try {
      const factura = await facturaModel.obtenerConDetalles(facturaId); // Usar obtenerConDetalles para cargar factura y detalles
      if (!factura) {
        return reply.status(404).send({ error: "Factura no encontrada" }); // 404 Not Found si no existe la factura
      }
      reply.send({ factura }); // Enviar la factura con detalles en la respuesta
    } catch (error) {
      console.error("Error al obtener detalles de factura:", error);
      reply
        .status(500)
        .send({
          error: "Error al obtener detalles de factura",
          detalles: error.message,
        });
    }
  },

  crearFacturaDebitoController: async (request, reply) => {
    const facturaModel = new Factura(fastify);
    const detalleFacturaModel = new DetalleFactura(fastify); // O new Factura(fastify) si no separaste el modelo

    try {
      const facturaData = request.body; // Asume que el frontend envía los datos de la factura en el body

      facturaData.tipo_factura = "debito";
      facturaData.estado_factura = "pagada"; // Débito = Pagada de inmediato
      facturaData.fecha_factura = new Date(); // Fecha actual por defecto
      facturaData.usuario_id = request.user.id;
      const detallesFacturaData = facturaData.detalles_factura; // Asume array de detalles en request.body.detalles_factura
      delete facturaData.detalles_factura;  // <-- ¡ESTA LÍNEA ES CORRECTA, elimina 'detalles_factura' del objeto facturaData ANTES de intentar insertar en 'facturas'

      // 1. Crear la factura principal
      const facturaCreada = await facturaModel.crear(facturaData);
      console.log(detalleFacturaModel);
      // 2. Crear los detalles de factura asociados
      if (detallesFacturaData && detallesFacturaData.length > 0) {
        for (const detalle of detallesFacturaData) {
          detalle.factura_id = facturaCreada.id; // Asignar el ID de la factura a cada detalle
          await detalleFacturaModel.crear(detalle); // Usar agregarDetalleFactura o crearDetalleFactura según tu modelo
        }
      }

      // 3.  [Opcional] Lógica para registrar la venta/actualizar stock (si es necesario, reutiliza o adapta tu lógica de ventas existente aquí)
      // ... (Lógica de registro de venta/stock) ...

      reply.status(201).send({
        factura: facturaCreada,
        message: "Factura a débito creada exitosamente",
      }); // 201 Created
    } catch (error) {
      console.error("Error al crear factura a débito:", error);
      reply.status(500).send({
        error: "Error al crear factura a débito",
        detalles: error.message,
      }); // 500 Internal Server Error
    }
  },
  crearFacturaCreditoController: async (request, reply) => {
    const facturaModel = new Factura(fastify);
    const detalleFacturaModel = new DetalleFactura(fastify); // O new Factura(fastify)
    const cuentaPorCobrarModel = new CuentaPorCobrar(fastify);

    try {
      const facturaData = request.body;
      facturaData.tipo_factura = "credito";
      facturaData.estado_factura = "pendiente"; // Crédito = Pendiente al inicio
      facturaData.fecha_factura = new Date();
      const detallesFacturaData = facturaData.detalles_factura; // ¡Guardamos los detalles ANTES de borrar! 
      delete facturaData.detalles_factura;

      // 1. Crear la factura principal
      const facturaCreada = await facturaModel.crear(facturaData);

      // 2. Crear los detalles de factura
      if (detallesFacturaData && detallesFacturaData.length > 0) {
        for (const detalle of detallesFacturaData) {
          detalle.factura_id = facturaCreada.id;
          await detalleFacturaModel.agregarDetalleFactura(detalle);
        }
      }

      // 3. Crear la cuenta por cobrar asociada
      const cuentaPorCobrarData = {
        factura_id: facturaCreada.id,
        saldo_inicial: facturaCreada.total_factura, // Saldo inicial = total de la factura
        saldo_actual: facturaCreada.total_factura,
        estado_cuenta: "pendiente", // Cuenta por cobrar empieza pendiente
      };
      const cuentaPorCobrarCreada = await cuentaPorCobrarModel.crear(
        cuentaPorCobrarData
      );

      reply.status(201).send({
        factura: facturaCreada,
        cuentaPorCobrar: cuentaPorCobrarCreada,
        message: "Factura a crédito y cuenta por cobrar creadas exitosamente",
      });
    } catch (error) {
      console.error("Error al crear factura a crédito:", error);
      reply.status(500).send({
        error: "Error al crear factura a crédito",
        detalles: error.message,
      });
    }
  },
  registrarPagoFacturaCreditoController: async (request, reply) => {
    const cuentaPorCobrarModel = new CuentaPorCobrar(fastify);
    const facturaModel = new Factura(fastify); // Instanciar modelo Factura

    const facturaId = request.params.id; // ID de la factura a pagar
    const { montoPagado } = request.body; // Asume que el frontend envía el monto del pago en el body

    if (!montoPagado || typeof montoPagado !== "number" || montoPagado <= 0) {
      return reply.status(400).send({ error: "Monto de pago inválido" }); // 400 Bad Request
    }

    try {
      const cuentaPorCobrarActualizada =
        await cuentaPorCobrarModel.registrarPago(facturaId, montoPagado);

      // Actualizar estado de la factura si la cuenta por cobrar se pagó completamente
      if (cuentaPorCobrarActualizada.estado_cuenta === "pagada") {
        await facturaModel.actualizar(facturaId, { estado_factura: "pagada" }); // Actualizar estado de la factura a 'pagada'
      }

      reply.send({
        cuentaPorCobrar: cuentaPorCobrarActualizada,
        message: "Pago registrado exitosamente",
      });
    } catch (error) {
      console.error("Error al registrar pago de factura a crédito:", error);
      reply
        .status(500)
        .send({ error: "Error al registrar pago", detalles: error.message });
    }
  },

  cancelarFacturaController: async (request, reply) => {
    const facturaModel = new Factura(fastify);
    const facturaId = request.params.id;
  
    try {
      const facturaActualizada = await facturaModel.actualizar(facturaId, { estado_factura: 'cancelada' }); // Actualizar estado a 'cancelada'
      if (!facturaActualizada) {
        return reply.status(404).send({ error: 'Factura no encontrada' });
      }
      reply.send({ factura: facturaActualizada, message: 'Factura cancelada exitosamente' });
    } catch (error) {
      console.error("Error al cancelar factura:", error);
      reply.status(500).send({ error: 'Error al cancelar factura', detalles: error.message });
    }
  }
});
