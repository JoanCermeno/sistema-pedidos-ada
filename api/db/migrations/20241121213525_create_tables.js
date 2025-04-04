/**
 * Migración para crear las tablas usuarios, productos y pedidos.
 */
export const up = async function (knex) {
  // Crear tabla usuarios (administradores)
  await knex.schema.createTable("usuarios", (table) => {
    table.increments("id").primary(); // ID auto-incremental
    table.string("nombre").notNullable(); // Nombre del usuario
    table.string("pass").notNullable(); // Contraseña
    table.timestamps(true, true); // Campos created_at y updated_at
  });
  // Crear tabla clientes (compradores)
  await knex.schema.createTable("clientes", (table) => {
    table.increments("id").primary(); // ID auto-incremental
    table.string("cedula").notNullable().unique(); // Cédula única
    table.string("nombre").notNullable(); // Nombre del cliente
    table.timestamps(true, true); // Campos created_at y updated_at
  });
  // Crear tabla productos
  await knex.schema.createTable("productos", (table) => {
    table.increments("id").primary();
    table.text("codigo_barra");
    table.string("nombre").notNullable();
    table.text("descripcion");
    table.decimal("precio_compra", 10, 2).defaultTo(0); // Añade la columna precio_compra
    table.decimal("precio_mayorista", 10, 2).defaultTo(0); // Precio al mayor
    table.decimal("precio_minorista", 10, 2).defaultTo(0); // Precio al detal (minorista)
    table.decimal("precio_libre", 10, 2).defaultTo(0);     // Precio libre (flexible)
    table.decimal("precio_bs", 10, 2).defaultTo(0); // Precio en bolivares
    table.integer("stock").defaultTo(0); // Cantidad disponible
    
    table.timestamps(true, true);
  });
  //crear tabla de ventas
  await knex.schema.createTable("ventas", (table) => {
    table.increments("id").primary();
    table.string("nombre_cliente").notNullable();
    table.string("cedula").notNullable();
    table.dateTime("fecha").notNullable();
    table.decimal("total", 10, 2).notNullable();
    table.decimal("total_bs", 10, 2).defaultTo(0);
    table.timestamps(true, true);
  });
  //crear tabla de  detalles de ventas
  await knex.schema.createTable("detalles_ventas", (table) => {
    table.increments("id").primary();
    table.integer("venta_id").unsigned().references("id").inTable("ventas").onDelete("CASCADE");
    table.integer("producto_id").unsigned().references("id").inTable("productos").onDelete("CASCADE");
    table.decimal("cantidad", 10, 2).notNullable();
    table.decimal("precio", 10, 2).notNullable();
    table.decimal("precio_bs", 10, 2).defaultTo(0);
    table.decimal("subtotal", 10, 2).notNullable();
    table.timestamps(true, true);
  });

  // Crear tabla pedidos
  await knex.schema.createTable("pedidos", (table) => {
    table.increments("id").primary();
    table
      .integer("cliente_id")
      .unsigned()
      .references("id")
      .inTable("clientes")
      .onDelete("CASCADE"); // Relación con clientes
    table.dateTime("fecha_pedido").notNullable();
    table.decimal("total", 10, 2).notNullable();
    table.timestamps(true, true);
  });

  // Crear tabla intermedia para pedidos y productos (muchos a muchos)
  await knex.schema.createTable("pedido_productos", (table) => {
    table.increments("id").primary();
    table
      .integer("pedido_id")
      .unsigned()
      .references("id")
      .inTable("pedidos")
      .onDelete("CASCADE"); // Relación con pedidos
    table
      .integer("producto_id")
      .unsigned()
      .references("id")
      .inTable("productos")
      .onDelete("CASCADE"); // Relación con productos
    table.integer("cantidad").notNullable(); // Cantidad de este producto en el pedido
  });

  // tasa del dolar en cada día
  await knex.schema.createTable("dolar_today", (table) => {
    table.increments("id").primary();
    table.date("fecha").notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.decimal("tasa", 10, 2).notNullable();
  });


};

export const down = async function (knex) {
  // Eliminar tablas en orden inverso
  await knex.schema.dropTableIfExists("pedido_productos");
  await knex.schema.dropTableIfExists("pedidos");
  await knex.schema.dropTableIfExists("productos");
  await knex.schema.dropTableIfExists("ventas");
  await knex.schema.dropTableIfExists("detalles_ventas");
  await knex.schema.dropTableIfExists("clientes");
  await knex.schema.dropTableIfExists("usuarios");
  await knex.schema.dropTableIfExists("dolar_today");
};
