import { prismaClient } from "../../database/PrismaClient.js";

export class RecipeRepository {
  async findAll(params) {
    return prismaClient.recipe.findMany(params);
  }

  async count(where) {
    return prismaClient.recipe.count({ where });
  }

  async findUnique(id) {
    return prismaClient.recipe.findUnique({ where: { id } });
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
