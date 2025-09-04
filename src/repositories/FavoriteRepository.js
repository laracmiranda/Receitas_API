import { prismaClient } from "../../database/PrismaClient.js";

export class FavoriteRepository {
  async findAll(params) {
    return prismaClient.favorite.findMany(params);
  }

  async count(where) {
    return prismaClient.favorite.count({ where });
  }

  async findUnique(userId, recipeId) {
    return prismaClient.favorite.findUnique({ 
      where: { userId_recipeId: { userId, recipeId } } 
    });
  }

  async create(data) {
    return prismaClient.favorite.create({ data });
  }

  async delete(userId, recipeId) {
    return prismaClient.favorite.delete({ 
      where: { userId_recipeId: { userId, recipeId } } 
    });
  }
}
