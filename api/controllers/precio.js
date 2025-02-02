import DolarToday from "../models/DolarToDay.js";
import Producto from "../models/Producto.js";
/** funcion para actualizar el precio del día de hoy */
export default (fastify) => ({
  actualizarPrecio: async (request, reply) => {
    // recibir el precio del día de hoy
    const { precio, today } = request.body;


    // validamos que sea un día válido
    if (!today.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return reply.status(400).send({ message: "Fecha no válida" });
    }

    //guardar el precio en la tabla dolar_today
    const dolarToday = new DolarToday(fastify);
    try {
    const resultadoActualizacion = await dolarToday.addDolarToday(today, precio);
      console.log("Tasa del dolar actualizada");
      //actaulizamos el precio en bolivares de todos los productos gracias al modelo de producto
      const updaterAllProducts = new Producto(fastify);
      const resultado = await updaterAllProducts.actualizarPrecioBs(resultadoActualizacion.tasa);
      if(resultado.success){
        console.log("Precios actualizados con éxito");
        reply.send( resultado); 
      }else{
       throw new Error(resultado.message);
      }

    } catch (error) {
      reply.status(500).send({ message: error });
    }
  },

  obtenerPrecio: async (request, reply) => {

     // Buscamos el ultimo update del precio del dolar
     const ultimaActualizacion = new DolarToday(fastify);
    try {
      const tasa = await ultimaActualizacion.getDolarToday();
      console.log("Precios actualizados con éxito");
      reply.send( tasa); 
    }catch (error) {
     throw new Error(error);
    } 
    
  

  },  
});
