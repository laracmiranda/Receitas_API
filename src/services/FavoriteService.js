import { paginate } from "../../utils/pagination.js";
import { NotFoundError, ForbiddenError, ConflictError } from "../errors/AppError.js";

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
    if (exists) throw new ConflictError("Receita já está nos favoritos");

    return this.favoriteRepository.create({ userId, recipeId });
  }

  async deleteFavorite(userId, recipeId) {
    const favorite = await this.favoriteRepository.findUnique(userId, recipeId);
    
    if (!favorite) throw new NotFoundError("Favorito não encontrado");
    if (favorite.userId !== userId) throw new ForbiddenError("Não autorizado");

    return this.favoriteRepository.delete(userId, recipeId);
  }
}
