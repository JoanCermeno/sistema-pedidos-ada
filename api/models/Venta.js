class Venta {
    constructor(fastify) {
      this.knex = fastify.knex;
    }
  
    // Obtener todas las ventas con sus detalles
    async getVentas(limit, offset, page, search) {

         // Consulta para contar el total de ventas (sin límite ni offset)
         let countQuery = this.knex("ventas").count("id as total").first();

         // Modifica la consulta de conteo si hay una búsqueda
         if (search) {
           countQuery = countQuery.where((builder) => {
             builder
               .where("nombre_cliente", "like", `%${search}%`);
           });
         }
         const totalVentasResult = await countQuery;
         const totalVentas = totalVentasResult ? parseInt(totalVentasResult.total, 10) : 0;
   
   
         // Consulta para obtener las ventas paginadas
         const query = this.knex("ventas").select("*")
           .limit(limit)
           .offset(offset);
   
         if (search) {
           query.where((builder) => {
             builder
               .where("nombre_cliente", "like", `%${search}%`);
           });
         }
   
         const allVentas = await query;

         // Obtener los IDs de las ventas paginadas para filtrar los detalles
      const ventaIdsPaginadas = allVentas.map(venta => venta.id);

      // Obtener detalles de ventas filtrando por los IDs de las ventas paginadas
      const detalles = await this.knex("detalles_ventas")
        .join("productos", "detalles_ventas.producto_id", "productos.id")
        .select(
          "detalles_ventas.*",
          "productos.nombre as producto_nombre",
          "productos.descripcion as producto_descripcion"
        )
        .whereIn("detalles_ventas.venta_id", ventaIdsPaginadas); // Filtrar detalles por venta_id

      // Combinar ventas con sus detalles (esta parte sigue igual)
      const ventasConDetalles = allVentas.map((venta) => {
        return {
          ...venta,
          detalles: detalles.filter((detalle) => detalle.venta_id === venta.id),
        };
      });

      return {
        ventas: ventasConDetalles,
        totalVentas: totalVentas // Devolver el total de ventas para la paginación
      };
    
    }
  
    // Crear una venta con sus detalles (si necesitas insertar en ambas tablas)
    async addVenta(ventaData) {
      const { detalles, ...venta } = ventaData;
      console.log(venta);
      // Usar transacción para asegurar consistencia
      return await this.knex.transaction(async (trx) => {
        try {
          // 1. Insertar venta
          const [ventaId] = await trx("ventas").insert(venta);
  
          // 2. Insertar detalles asociados a la venta
          const detallesConVentaId = detalles.map((detalle) => ({
            ...detalle,
            venta_id: ventaId,
          }));
  
          await trx("detalles_ventas").insert(detallesConVentaId);
  
          // 3. Actualizar el Stock en 'productos'
          for (const detalle of detalles) { // Iterar sobre 'detalles' que ya tienes de ventaData
            const productoId = detalle.producto_id;
            const cantidadVendida = detalle.cantidad;
  
            // Obtener el producto para verificar stock y actualizarlo (¡Dentro de la transacción!)
            const producto = await trx('productos').where('id', productoId).first();
            if (!producto) {
              throw new Error(`Producto con ID ${productoId} no encontrado al actualizar stock.`);
            }
  
            const stockActual = producto.stock;
            const nuevoStock = stockActual - cantidadVendida;
  
            if (nuevoStock < 0) {
              throw new Error(`Stock insuficiente para el producto ${producto.nombre} (ID: ${productoId}). Stock actual: ${stockActual}, cantidad requerida: ${cantidadVendida}. Venta no guardada.`);
            }
  
            // Actualizar stock del producto
            await trx('productos')
              .where('id', productoId)
              .update({ stock: nuevoStock });
          }
  
          // Si todo sale bien, commit de la transacción
          return ventaId;
        } catch (error) {
          // Si hay un error, rollback de la transacción
          trx.rollback(error);
          throw error; // Relanzar el error para que se maneje en el controlador
        }
      });
    }
  }
  
  export default Venta; // Asegúrate de que el nombre de la clase coincida con el export