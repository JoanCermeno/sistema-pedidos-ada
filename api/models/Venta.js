class Venta {
    constructor(fastify) {
      this.knex = fastify.knex;
    }
  
    // Obtener todas las ventas con sus detalles
    async allVentas() {
      // Obtener todas las ventas
      const ventas = await this.knex("ventas").select("*");
    
      // Obtener detalles de ventas con información de productos
      const detalles = await this.knex("detalles_ventas")
        .join("productos", "detalles_ventas.producto_id", "productos.id")
        .select(
          "detalles_ventas.*", // Seleccionar todos los campos de detalles_ventas
          "productos.nombre as producto_nombre", // Nombre del producto
          "productos.descripcion as producto_descripcion" // Descripción del producto
        );
    
      // Combinar ventas con sus detalles
      const ventasConDetalles = ventas.map((venta) => {
        return {
          ...venta,
          detalles: detalles.filter((detalle) => detalle.venta_id === venta.id),
        };
      });
    
      return ventasConDetalles;
    }
  
    // Crear una venta con sus detalles (si necesitas insertar en ambas tablas)
    async addVenta(ventaData) {
      const { detalles, ...venta } = ventaData;
      console.log(venta);
      // Usar transacción para asegurar consistencia
      return await this.knex.transaction(async (trx) => {
        // Insertar venta
        const [ventaId] = await trx("ventas").insert(venta);
  
        // Insertar detalles asociados a la venta
        const detallesConVentaId = detalles.map((detalle) => ({
          ...detalle,
          venta_id: ventaId,
        }));
  
        await trx("detalles_ventas").insert(detallesConVentaId);
  
        return ventaId;
      });
    }
  }
  
  export default Venta; // Asegúrate de que el nombre de la clase coincida con el export