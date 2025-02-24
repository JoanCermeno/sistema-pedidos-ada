import jwt from "jsonwebtoken"; // Importamos JSON Web Token
import validarToken from "../controllers/validarTokenSession.js";
import userControllers from "../controllers/user.js";
import clienteController from "../controllers/cliente.js";
import pedidoController from "../controllers/pedido.js";
import productoCOntroller from "../controllers/producto.js";
import facturaController from "../controllers/facturasController.js";
import precioController from "../controllers/precio.js";
import helloController from "../controllers/hello.js";
import ventaController from "../controllers/ventas.js";
import auditoriaController from "../controllers/auditoria.js";
import Test from "../models/Test.js";

async function routes(fastify, options) {
  //middelwares para proteger las rutas
  async function authMiddleware(request, reply) {
    try {
      const token = request.headers["authorization"].split(" ")[1]; // Asumiendo que el token está en el encabezado Authorization
      if (!token) {
        throw new Error("Token no proporcionado");
      }
      const decoded = jwt.verify(token, fastify.config.JWT_SECRET);
      request.user = decoded; // Almacenamos los datos del usuario en la solicitud
      return decoded;
    } catch (error) {
      console.log(error);
      return reply.status(401).send({ message: "Token inválido o expirado" });
    }
  }

  //ojo muy importante pasamos el objeto fastify a todos los controladores y depues si extraemos las funciones
  const { autenticarUsuario, addUser } = userControllers(fastify);
  const { obtenerClientes , buscarClientePorCedula, agregarCliente } = clienteController(fastify);
  const { obtenerPedidos } = pedidoController(fastify);
  const {
    allProductos,
    addProductosFrom,
    addProducto,
    editProducto,
    deleteProducto,
    getProductoById,
  } = productoCOntroller(fastify);
  const { hi } = helloController(fastify);
  const { validateTokenSession } = validarToken(fastify);
  const { actualizarPrecio } = precioController(fastify);
  const { obtenerPrecio } = precioController(fastify);
  const { addVenta, allVentas } = ventaController(fastify);
  const { showAudit } = auditoriaController(fastify);

  //importando controllers de facturas
  const {
    listarFacturasController,
    obtenerDetallesFacturaController,
    crearFacturaDebitoController,
    crearFacturaCreditoController,
    registrarPagoFacturaCreditoController,
    cancelarFacturaController,
  } = facturaController(fastify);

  //rutas
  fastify.get("/", hi);

  //auth
  fastify.post("/auth", autenticarUsuario);
  fastify.post("/validateTokenSession", validateTokenSession);

  fastify.post("/usuario", addUser);

  //producto
  fastify.get("/productos", { preHandler: authMiddleware }, allProductos);
  fastify.get("/producto/:id", { preHandler: authMiddleware }, getProductoById);
  // AGREGAR VARIOS PRODUCTOS DE UNA SOLA VEZ
  fastify.post("/productos", { preHandler: authMiddleware }, addProductosFrom);
  //AGREGAR UN SOLO PRODUCTO
  fastify.post("/producto", { preHandler: authMiddleware }, addProducto);
  fastify.patch("/producto/:id", { preHandler: authMiddleware }, editProducto);
  fastify.delete(
    "/producto/:id",
    { preHandler: authMiddleware },
    deleteProducto
  );
  //Auditoria
  fastify.get("/audit", { preHandler: authMiddleware }, showAudit);

  // Rutas para facturas a débito
  fastify.post('/facturas/debito',{ preHandler: authMiddleware }, crearFacturaDebitoController);

  // Rutas para facturas a crédito
  fastify.post('/facturas/credito',{ preHandler: authMiddleware }, crearFacturaCreditoController);
  fastify.post('/facturas/:id/pagar', { preHandler: authMiddleware },registrarPagoFacturaCreditoController); // Opcional

  // Rutas para obtener facturas
  fastify.get('/facturas',{ preHandler: authMiddleware }, listarFacturasController);
  fastify.get('/facturas/:id',{ preHandler: authMiddleware }, obtenerDetallesFacturaController);

  // Ruta para cancelar factura (opcional)
  fastify.post('/facturas/:id/cancelar', cancelarFacturaController); // Opcional



  //clientes
  fastify.get("/cliente", { preHandler: authMiddleware }, obtenerClientes);
  fastify.post("/cliente", { preHandler: authMiddleware }, agregarCliente);

  //pedidos
  fastify.get("/pedido", { preHandler: authMiddleware }, obtenerPedidos);

  // precios del día
  fastify.post("/tasaDolar", { preHandler: authMiddleware }, actualizarPrecio);
  //obtener el precio del día
  fastify.get("/tasaDolar", { preHandler: authMiddleware }, obtenerPrecio);

  // post venta
  fastify.post("/venta", { preHandler: authMiddleware }, addVenta);
  // get ventas
  fastify.get("/venta", { preHandler: authMiddleware }, allVentas);

  // prueba
  fastify.get("/clientesOf", async (request, reply) => {
    const clientesModelTest = new Test(fastify);
    const id = request.query.id;
    const alldata = await clientesModelTest.getClientesOfmaster(id);
    console.log(id);
    reply.send(alldata);
  });
  fastify.post("/clientesOf", async (request, reply) => {
    const listaPersonasToSave = request.body;
    const updateRegister = new Test(fastify);
    const result = await updateRegister.guardarClientes(listaPersonasToSave);
    console.log(result);
    reply.send(true);
  });
  fastify.post("/clientesOfTemporal", async (request, reply) => {
    const listaPersonasToSave = request.body;
    console.log(listaPersonasToSave);
    reply.send("hola");
  });
}

export default routes;
