class Auditoria {
  constructor(fastify) {
      this.knex = fastify.knex;
  }

  async getAudit(limit, offset, page, search = null)  {
      // 1. Consulta para obtener los registros paginados
      const logsAudit = await this.knex("productos_audit")
          .select("*")
          .orderBy("id", "desc")
          .limit(limit) // Aplica el límite (registros por página)
          .offset(offset); // Aplica el desplazamiento (desde qué registro empezar)

      // 2. Consulta para obtener el total de registros (sin paginar)
      const totalCountResult = await this.knex("productos_audit")
          .count('* as total') // Cuenta todas las filas y alias la columna de conteo como 'total'
          .first(); // Devuelve solo la primera fila del resultado (que contiene el conteo total)
      const totalCount = totalCountResult.total; // Extrae el valor del conteo total

      return {
          logsAudit, // Datos paginados
          totalCount, // Total de registros
          currentPage: page, // Página actual (opcional, pero útil para el frontend)
          totalPages: Math.ceil(totalCount / limit), // Total de páginas (opcional, útil para el frontend)
      };
  }
}

export default Auditoria;