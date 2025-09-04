import { RecipeRepository } from "../repositories/RecipeRepository.js";
import { RecipeService } from "../services/RecipeService.js";

const recipeRepository = new RecipeRepository();
const recipeService = new RecipeService(recipeRepository);

export class RecipeController {
  findAllRecipes = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const orderBy = req.query.orderBy || "creationDate";
      const sort = req.query.sort || "desc";

      const recipes = await recipeService.getAllRecipes({ page, limit, orderBy, sort });

      return res.status(200).json(recipes);
    } catch (error) {
        console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };

  findRecipe = async (req, res) => {
    try {
      const { id } = req.params;
      const recipe = await recipeService.getRecipeById(id);

      if (!recipe) return res.status(404).json({ error: "Receita não encontrada" });

      return res.status(200).json(recipe);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };

  findRecipeByUser = async (req, res) => {
    try {
      const userId = req.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sort = req.query.sort || "desc";

      const recipes = await recipeService.getRecipesByUser(userId, { page, limit, sort });

      return res.status(200).json(recipes);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };

  createRecipe = async (req, res) => {
    try {
      const { name, category, ingredients, steps } = req.body;
      const userId = req.userId;

      const recipe = await recipeService.createRecipe({
        name,
        category,
        ingredients,
        steps,
        userId,
        file: req.file,
      });

      return res.status(201).json(recipe);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };

  updateRecipe = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId;
      const { name, category, ingredients, steps } = req.body;

      const recipe = await recipeService.updateRecipe(id, userId, {
        name,
        category,
        ingredients,
        steps,
        file: req.file,
      });

      return res.status(200).json(recipe);
    } catch (error) {
      if (error.message === "NOT_FOUND")
        return res.status(404).json({ error: "Receita não encontrada" });
      if (error.message === "FORBIDDEN")
        return res.status(403).json({ error: "Você não tem permissão para editar esta receita" });

      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };

  deleteRecipe = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      await recipeService.deleteRecipe(id, userId);

      return res.status(204).json({ message: "Receita deletada com sucesso" });
    } catch (error) {

      if (error.message === "NOT_FOUND")
        return res.status(404).json({ error: "Receita não encontrada" });

      if (error.message === "FORBIDDEN")
        return res.status(403).json({ error: "Você não tem permissão para excluir esta receita" });

      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  };
}
