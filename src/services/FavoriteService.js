import { paginate } from "../../utils/pagination.js";

export class FavoriteService {
  constructor(favoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async getFavorites(userId, { page = 1, limit = 10, sort = "desc" }) {
    const model = {
      findMany: (params) => this.favoriteRepository.findAll(params),
      count: (where) => this.favoriteRepository.count(where),
    };

    return paginate(model, {
      where: { userId },
      page,
      limit,
      orderBy: { creationDate: sort },
      include: { recipe: true },
    });
  }

  async addFavorite(userId, recipeId) {
    const exists = await this.favoriteRepository.findUnique(userId, recipeId);
    if (exists) throw new Error("ALREADY_EXISTS");

    return this.favoriteRepository.create({ userId, recipeId });
  }

  async deleteFavorite(userId, recipeId) {
    const favorite = await this.favoriteRepository.findUnique(userId, recipeId);
    if (!favorite) throw new Error("NOT_FOUND");
    if (favorite.userId !== userId) throw new Error("FORBIDDEN");

    return this.favoriteRepository.delete(userId, recipeId);
  }
}
