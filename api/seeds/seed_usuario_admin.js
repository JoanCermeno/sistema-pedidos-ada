import bcrypt from "bcrypt";
export async function seed(knex) {
  // Limpia la tabla (opcional, evita duplicados)
  await knex("usuarios").del();
  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash("admin", 10);

  // Inserta el usuario administrador
  await knex("usuarios").insert([
    {
      nombre: "joan",
      pass: hashedPassword, // Encripta este dato en producción
      created_at: new Date(),
      updated_at: new Date(),
    },

  ]);
}
