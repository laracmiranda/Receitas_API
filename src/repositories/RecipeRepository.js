import { prismaClient } from "../../database/PrismaClient.js";

export class RecipeRepository {
  async findAll(params) {
    return prismaClient.recipe.findMany({
      ...params,
      include: { ...params.include,
        _count: { select: { favorites: true } },
      },
    });
  }

  async count(where) {
    return prismaClient.recipe.count({ where });
  }

  async findUnique(id) {
    return prismaClient.recipe.findUnique({ 
      where: { id },
      include: {
        _count: { select: { favorites: true } },
        user: { select: { id: true, name: true } },
      },
    });
  }

  async create(data) {
    return prismaClient.recipe.create({ data });
  }

  async update(id, data) {
    return prismaClient.recipe.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return prismaClient.recipe.delete({ where: { id } });
  }
}
