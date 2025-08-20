import express from "express";
import { UserController } from "../controllers/UserController.js";
import { RecipeController } from "../controllers/RecipeController.js";

const router = express.Router();

const userController = new UserController();
const recipeController = new RecipeController();

// User routes
router.get("/users", userController.findAllUsers);
router.get("/user/:id", userController.findUser);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

// Recipe routes
router.get("/recipes", recipeController.findAllRecipes);
router.get("/recipe/:id", recipeController.findRecipe);
router.post("/recipes", recipeController.createRecipe);
router.put("/recipes/:id", recipeController.updateRecipe);
router.delete("/recipes/:id", recipeController.deleteRecipe);

export { router }