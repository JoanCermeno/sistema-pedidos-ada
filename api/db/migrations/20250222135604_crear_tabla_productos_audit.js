/**
 * Migración para crear la tabla productos_audit.
 */
export const up = async function (knex) {
    await knex.schema.createTable("productos_audit", (table) => {
      table.increments("id").primary();
      table.integer("producto_id").notNullable().references("id").inTable("productos").onDelete("CASCADE"); // Clave foránea a productos
      table.integer("usuario_id").nullable(); // Opcional: Usuario que hizo el cambio
      table.string("tipo_operacion").notNullable(); // Tipo de operación: 'creacion', 'edicion', 'eliminacion'
      table.dateTime("fecha_hora").defaultTo(knex.fn.now()); // Fecha y hora del cambio
      table.text("datos_antes"); // Datos del producto ANTES del cambio (JSON)
      table.text("datos_despues"); // Datos del producto DESPUÉS del cambio (JSON)
    });
  };
  
  export const down = async function (knex) {
    await knex.schema.dropTableIfExists("productos_audit");
  };