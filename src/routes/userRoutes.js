import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import authenticate from "../middlewares/authenticate.js";
import { RecipeController } from "../controllers/RecipeController.js";
import { FavoriteController } from "../controllers/FavoriteController.js";

const router = Router();
const userController = new UserController();
const recipeController = new RecipeController();
const favoriteController = new FavoriteController();

// Rotas de Perfil
router.get("/", userController.findAllUsers);
router.get("/:id", userController.findUser);
router.get("/me", authenticate, userController.findUserAuthenticated);
router.post("/", userController.createUser);
router.put("/me", authenticate, userController.updateUser);
router.delete("/me", authenticate, userController.deleteUser);

// Rotas de Segurança
router.put("/me/change-password", authenticate, userController.changePassword);

// Rotas do Usuário
router.get("/me/recipes", authenticate, recipeController.findRecipeByUser);
router.get("/me/favorites", authenticate, favoriteController.findFavorites);

export default router;
