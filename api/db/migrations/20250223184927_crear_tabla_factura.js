export const up = async function(knex) {
    await knex.schema.createTable('facturas', (table) => {
      table.increments('id').primary();
      table.enum('tipo_factura', ['debito', 'credito']).notNullable();
      // Si tienes tabla de clientes:
      table.integer('cliente_id').unsigned().references('id').inTable('clientes').onDelete('SET NULL');
      table.date('fecha_factura').notNullable();
      table.date('fecha_vencimiento').nullable(); // Opcional
      table.enum('estado_factura', ['pendiente', 'pagada', 'cancelada']).defaultTo('pendiente');
      table.decimal('total_factura', 10, 2).notNullable();
      table.decimal('total_pagado', 10, 2).defaultTo(0); // Opcional
      // table.decimal('saldo_pendiente', 10, 2).defaultTo(0); // Opcional, podría ser calculado
      table.string('metodo_pago').nullable(); // Solo para débito
      table.integer('usuario_id').unsigned().references('id').inTable('usuarios').onDelete('SET NULL');
      table.text('observaciones'); // Opcional
      table.timestamps(true, true);
    });
    //crear tabla de  detalles de la factura
    await knex.schema.createTable('detalles_facturas', (table) => {
        table.increments('id').primary();
        table.integer('factura_id').unsigned().references('id').inTable('facturas').onDelete('CASCADE');
        table.integer('producto_id').unsigned().references('id').inTable('productos').onDelete('CASCADE');
        table.decimal('cantidad', 10, 2).notNullable();
        table.decimal('precio_unitario', 10, 2).notNullable();
        table.decimal('precio_unitario_bs', 10, 2).defaultTo(0); // Opcional
        table.decimal('subtotal', 10, 2).notNullable();
        table.timestamps(true, true);
      });
      // Crear TAbla de pendientes por cobrar, para saber quien debe a la empresa
    await knex.schema.createTable('cuentas_por_cobrar', (table) => {
        table.increments('id').primary();
        table.integer('factura_id').unsigned().references('id').inTable('facturas').onDelete('CASCADE').unique();
        table.decimal('saldo_inicial', 10, 2).notNullable();
        table.decimal('saldo_actual', 10, 2).notNullable();
        table.date('fecha_proximo_pago').nullable(); // Opcional
        table.enum('estado_cuenta', ['pendiente', 'parcialmente_pagada', 'pagada', 'vencida']).defaultTo('pendiente');
        table.text('observaciones'); // Opcional
        table.timestamps(true, true);
      });


  }
  
  export const down = async function down(knex) {
    await knex.schema.dropTableIfExists('facturas');
    await knex.schema.dropTableIfExists('detalles_facturas');
    await knex.schema.dropTableIfExists('cuentas_por_cobrar');
  }