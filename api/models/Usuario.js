// models/Usuario.js
import bcrypt from "bcrypt";

class User {
  constructor(fastify) {
    this.knex = fastify.knex; // Accedemos a la instancia de Knex desde Fastify
  }

  async obtenerTodos() {
    const allPedido = this.knex("usuarios").select("*");
    return allPedido;
  }

  async authUser(iUser, iPass) {
    // 1. Buscar al usuario por el nombre de usuario
    const usuario = await this.knex("usuarios").where("nombre", iUser).first();

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    // 2. Verificar la contraseña (comparar el hash de la contraseña)
    const passwordMatch = await bcrypt.compare(iPass, usuario.pass);

    if (!passwordMatch) {
      throw new Error("Contraseña incorrecta");
    }

    return usuario; // Si la contraseña es correcta, devolvemos el usuario
  }

  //agregar usuario
  async addUser(nombre, pass) {
    const saltRounds = 10;

    try {
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(pass, saltRounds);

      // Aquí deberías tener conexión a tu base de datos
      // Por ejemplo, usando Knex con Fastify:
      const result = await this.knex("usuarios").insert({
        nombre,
        pass: hashedPassword, // Guarda la contraseña encriptada
      });

      console.log(`Usuario agregado con id: ${result[0]}`);
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      return 1;
    }

    return 0;
  }
}

export default User;
