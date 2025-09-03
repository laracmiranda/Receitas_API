import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";
import { RecipeController } from "../controllers/RecipeController.js";
import { CommentController } from "../controllers/CommentController.js";
import { FavoriteController } from "../controllers/FavoriteController.js";

const router = Router();
const recipeController = new RecipeController();
const commentController = new CommentController();
const favoriteController = new FavoriteController();

// Rotas de Receitas
router.get("/", recipeController.findAllRecipes);
router.get("/:id", recipeController.findRecipe);
router.post("/", authenticate, upload.single("image"), recipeController.createRecipe);
router.put("/:id", authenticate, upload.single("image"), recipeController.updateRecipe);
router.delete("/:id", authenticate, recipeController.deleteRecipe);

// Rotas de Comentários
router.get("/:recipeId/comments", commentController.findCommentsByRecipe);
router.post("/:recipeId/comments", authenticate, commentController.createComment);
router.delete("/:recipeId/comments/:id", authenticate, commentController.deleteComment);

// Rotas de Favoritos
router.post("/:recipeId/favorite", authenticate, favoriteController.addFavorite);
router.delete("/:recipeId/favorite", authenticate, favoriteController.deleteFavorite);

export default router;
