import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import authenticate from "../middlewares/authenticate.js";
import { RecipeController } from "../controllers/RecipeController.js";
import { FavoriteController } from "../controllers/FavoriteController.js";
import { upload } from "../middlewares/upload.js";

const router = Router();
const userController = new UserController();
const recipeController = new RecipeController();
const favoriteController = new FavoriteController();

// Rotas de Perfil
router.get("/", userController.findAllUsers);
router.get("/me", authenticate, userController.findUserAuthenticated);
router.get("/:id", userController.findUser);
router.post("/", userController.createUser);

// Rotas de Segurança e Conta
router.put("/me/change-password", authenticate, userController.changePassword);
router.put("/me", authenticate, userController.updateUser);
router.delete("/me", authenticate, userController.deleteUser);

// Recursos do Usuário
// Receitas
router.get("/me/recipes", authenticate, recipeController.findRecipeByUser);
router.put("/me/recipes/:id", authenticate, upload.single("image"), recipeController.updateRecipe);
router.delete("/me/recipes/:id", authenticate, recipeController.deleteRecipe);

// Favoritos
router.get("/me/favorites", authenticate, favoriteController.findFavorites);
router.delete("/me/favorites/:recipeId", authenticate, favoriteController.deleteFavorite);


export default router;
