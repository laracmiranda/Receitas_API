import { FavoriteRepository } from "../repositories/FavoriteRepository.js";
import { FavoriteService } from "../services/FavoriteService.js";

const favoriteRepository = new FavoriteRepository();
const favoriteService = new FavoriteService(favoriteRepository);

export class FavoriteController {
  findFavorites = async (req, res, next) => {
    try {
      const userId = req.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sort = req.query.sort || "desc";

      const favorites = await favoriteService.getFavorites(userId, { page, limit, sort });
      
      return res.status(200).json(favorites);
    } catch (error) {
      next(error);
    }
  };

  addFavorite = async (req, res, next) => {
    try {
      const userId = req.userId;
      const { recipeId } = req.params;

      const favorite = await favoriteService.addFavorite(userId, recipeId);

      return res.status(201).json(favorite);
    } catch (error) {
      next(error);
    }
  };

  deleteFavorite = async (req, res, next) => {
    try {
      const userId = req.userId;
      const { recipeId } = req.params;

      await favoriteService.deleteFavorite(userId, recipeId);

      return res.status(200).json({ message: "Receita removida dos favoritos" });
    } catch (error) {
      next(error);
    }
  };
}
