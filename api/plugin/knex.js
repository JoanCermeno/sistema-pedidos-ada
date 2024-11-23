// knex-plugin.js
import knex from "knex";
import fp from "fastify-plugin";

const knexPlugin = (fastify, options, done) => {
  //rificamos si fastify.knex ya existe para evitar conflictos si este plugin se registra más de una vez.
  if (!fastify.knex) {
    const knexInstance = knex(options);
    fastify.decorate("knex", knexInstance);
    //Se asegura de destruir la instancia de knex al cerrar la aplicación, previniendo fugas de recursos.
    fastify.addHook("onClose", (instance, done) => {
      if (instance.knex === knexInstance) {
        instance.knex.destroy(done);
      }
    });
  }

  done();
};
export default fp(knexPlugin, { name: "fastify-knex" });
