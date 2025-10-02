import { prismaClient } from "../../database/PrismaClient.js";

export class RatingRepository {
    
  async create(data) {
    return prismaClient.rating.create({ data });
  }

  async update(id, data) {
    return prismaClient.rating.update({
      where: { id },
      data,
    });
  }

  async findByUserAndRecipe(userId, recipeId) {
    return prismaClient.rating.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });
  }

  async getAverageByRecipe(recipeId) {
    const result = await prismaClient.rating.aggregate({
      where: { recipeId },
      _avg: { value: true },
      _count: { value: true },
    });
    return {
      average: result._avg.value ? parseFloat(result._avg.value.toFixed(2)) : 0,
      count: result._count.value,
    };
  }
}
