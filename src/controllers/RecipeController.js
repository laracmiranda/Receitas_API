import { ValidationError } from "../errors/AppError.js";
import { RecipeRepository } from "../repositories/RecipeRepository.js";
import { RecipeService } from "../services/RecipeService.js";
import { createRecipeSchema } from "../validators/recipeValidator.js";

const recipeRepository = new RecipeRepository();
const recipeService = new RecipeService(recipeRepository);

export class RecipeController {
  findAllRecipes = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const orderBy = req.query.orderBy || "creationDate";
      const sort = req.query.sort || "desc";

      const recipes = await recipeService.getAllRecipes({ page, limit, orderBy, sort });

      return res.status(200).json(recipes);
    } catch (error) {
      next(error);
    }
  };

  findRecipe = async (req, res, next) => {
    try {
      const { recipeId } = req.params;
      const recipe = await recipeService.getRecipeById(recipeId);

      return res.status(200).json(recipe);
    } catch (error) {
      next(error);
    }
  };

  findRecipeByUser = async (req, res, next) => {
    try {
      const userId = req.userId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sort = req.query.sort || "desc";

      const recipes = await recipeService.getRecipesByUser(userId, { page, limit, sort });

      return res.status(200).json(recipes);
    } catch (error) {
      next(error);
    }
  };

  createRecipe = async (req, res, next) => {
    const { error, value } = createRecipeSchema.validate(req.body);
    if (error) return next(new ValidationError(error.details[0].message));

    try {
      const recipe = await recipeService.createRecipe({ ...value, userId: req.userId, file: req.file });

      return res.status(201).json(recipe);
    } catch (error) {
      next(error);
    }
  };

  updateRecipe = async (req, res, next) => {
    const { error, value } = createRecipeSchema.validate(req.body);
    if (error) return next(new ValidationError(error.details[0].message));

    try {
      const { recipeId } = req.params;
      const userId = req.userId;
      
      const recipe = await recipeService.updateRecipe(recipeId, userId, {
        ...value,
        file: req.file,
      });

      return res.status(200).json(recipe);
    } catch (error) {
      next(error);
    }
  };

  deleteRecipe = async (req, res, next) => {
    try {
      const { recipeId } = req.params;
      const userId = req.userId;

      await recipeService.deleteRecipe(recipeId, userId);

      return res.status(200).json({ message: "Receita deletada com sucesso" });
    } catch (error) {
      next(error);
    }
  };
}
