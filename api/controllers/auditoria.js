//file controllers/auditoria.js
import Auditoria from "../models/Audit.js";

export default (fastify) => ({
  showAudit: async (request, reply) => {
    const { page = 1, limit = 20 } = request.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const safeLimit = isNaN(limitNum) ? 20 : limitNum;
    const safePage = isNaN(pageNum) ? 1 : pageNum;
    const offset = (safePage - 1) * safeLimit;

    const modelAudit = new Auditoria(fastify);
    const logsAudit = await modelAudit.getAudit(
      limit,
      offset,
      page
    );
    reply.send(logsAudit);
  },
});
