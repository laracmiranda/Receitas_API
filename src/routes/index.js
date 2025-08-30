import express from "express";
import { UserController } from "../controllers/UserController.js";
import { RecipeController } from "../controllers/RecipeController.js";
import { upload } from "../middlewares/upload.js";
import { AuthController} from "../controllers/AuthController.js";
import authenticate from "../middlewares/authenticate.js";
import { CommentController } from "../controllers/CommentController.js";
import { FavoriteController } from "../controllers/FavoriteController.js";

const router = express.Router();

const userController = new UserController();
const recipeController = new RecipeController();
const authController = new AuthController();
const commentController = new CommentController();
const favoriteController = new FavoriteController();

// User routes
router.get("/users", userController.findAllUsers);
router.get("/user/:id", userController.findUser);
router.get("/user/me", userController.findUserAuthenticated);
router.post("/users", userController.createUser);
router.put("/users/me", authenticate, userController.updateUser);
router.put("/users/me/change-password", authenticate, userController.changePassword);
router.delete("/users/me", authenticate, userController.deleteUser);

// Recipe routes
router.get("/recipes", recipeController.findAllRecipes);
router.get("/recipe/:id", recipeController.findRecipe);
router.get("/users/me/recipes", authenticate, recipeController.findRecipeByUser);
router.post("/recipes", authenticate, upload.single("image"), recipeController.createRecipe);
router.put("/recipes/:id", authenticate, upload.single("image"), recipeController.updateRecipe);
router.delete("/recipes/:id", authenticate, recipeController.deleteRecipe);

// Comment routes 
router.get("/recipes/:recipeId/comments", commentController.findCommentsByRecipe);
router.post("/recipes/:recipeId/comments", authenticate, commentController.createComment);
router.delete("/recipes/:recipeId/comments/:id", authenticate, commentController.deleteComment);

// Favorite routes
router.get("/favorites", authenticate, favoriteController.findFavorites);
router.post("/recipes/:recipeId/favorite", authenticate, favoriteController.addFavorite);
router.delete("/recipes/:recipeId/favorite", authenticate, favoriteController.deleteFavorite);

// Auth routes
router.post("/auth/login", authController.login)
router.post("/auth/request-reset", authController.requestPasswordReset)
router.post("/auth/reset-password/:token", authController.resetPassword)

export { router }