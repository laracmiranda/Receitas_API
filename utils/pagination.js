/**
 * @param {Object} model - O model Prisma (ex: prismaClient.recipe)
 * @param {Object} options - Opções da query
 * @param {Object} [options.where] - Filtros
 * @param {Object} [options.orderBy] - Ordenação
 * @param {number} [options.page=1] - Página atual
 * @param {number} [options.limit=10] - Itens por página
 * @param {Object} [options.include] - Include (relacionamentos)
 * @returns {Object} resultado paginado: { page, limit, total, totalPages, data }
 */

export async function paginate(model, { where = {}, orderBy = {}, page = 1, limit = 10, include = {} }) {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.findMany({ where, orderBy, skip, take: limit, include }),
    model.count({ where }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data,
  };
}
