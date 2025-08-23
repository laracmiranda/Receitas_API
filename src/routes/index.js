import express from "express";
import { UserController } from "../controllers/UserController.js";
import { RecipeController } from "../controllers/RecipeController.js";
import { upload } from "../middlewares/upload.js";
import { LoginController } from "../controllers/LoginController.js";

const router = express.Router();

const userController = new UserController();
const recipeController = new RecipeController();
const loginController = new LoginController();

// User routes
router.get("/users", userController.findAllUsers);
router.get("/user/:id", userController.findUser);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

// Recipe routes
router.get("/recipes", recipeController.findAllRecipes);
router.get("/recipe/:id", recipeController.findRecipe);
router.post("/recipes", upload.single("image"), recipeController.createRecipe);
router.put("/recipes/:id", upload.single("image"), recipeController.updateRecipe);
router.delete("/recipes/:id", recipeController.deleteRecipe);

// Login routes
router.post("/login", loginController.login)

export { router }