// knexfile.js
export default {
  client: "sqlite3",
  connection: {
    filename: "./db/dev.db",
  },
  useNullAsDefault: true, // Requerido para SQLite
  migrations: {
    directory: "./db/migrations", // Ruta para guardar las migraciones
  },
};
