import { FavoriteRepository } from "../repositories/FavoriteRepository.js";
import { FavoriteService } from "../services/FavoriteService.js";

const favoriteRepository = new FavoriteRepository();
const favoriteService = new FavoriteService(favoriteRepository);

export class FavoriteController {
  async findFavorites(req, res) {
    try {
      const userId = req.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sort = req.query.sort || "desc";

      const favorites = await favoriteService.getFavorites(userId, { page, limit, sort });
      
      return res.status(200).json(favorites);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar receitas favoritadas" });
    }
  }

  async addFavorite(req, res) {
    try {
      const userId = req.userId;
      const { recipeId } = req.params;

      const favorite = await favoriteService.addFavorite(userId, recipeId);

      return res.status(201).json(favorite);
    } catch (error) {
      if (error.message === "ALREADY_EXISTS") {
        return res.status(400).json({ error: "Receita já está nos favoritos" });
      }

      return res.status(500).json({ error: "Erro ao adicionar favorito" });
    }
  }

  async deleteFavorite(req, res) {
    try {
      const userId = req.userId;
      const { recipeId } = req.params;

      await favoriteService.deleteFavorite(userId, recipeId);

      return res.status(200).json({ message: "Receita removida dos favoritos" });
    } catch (error) {
      if (error.message === "NOT_FOUND") {
        return res.status(404).json({ error: "Favorito não encontrado" });
      }

      if (error.message === "FORBIDDEN") {
        return res.status(403).json({ error: "Não autorizado" });
      }

      return res.status(500).json({ error: "Erro ao remover favorito" });
    }
  }
}
