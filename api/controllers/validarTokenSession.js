import jwt from "jsonwebtoken";

export default (fastify) => ({
  validateTokenSession: async (request, reply) => {

    
    // validar el token que viene en la peticion
    const token = request.headers["authorization"].split(" ")[1];
    console.log(token);
    try {
      if (!token) {
        throw new Error("Token no proporcionado");
      }

      const decoded = jwt.verify(token, fastify.config.JWT_SECRET);

      //revisamos el tiempo de expiración del token
      const expirationTime = decoded.exp * 1000;
      const currentTime = new Date().getTime();
      console.log(expirationTime);
      console.log(currentTime);
      if (expirationTime < currentTime) {
        console.log("Token expirado");
        throw new Error("Token expirado");
      }
      console.log("Token validado");
      reply.status(200).send({ message: "Token validado" });
    } catch (error) {
      console.log(error);
      return reply.status(401).send({ message: "Token inválido o expirado" });
    }
  },
});
