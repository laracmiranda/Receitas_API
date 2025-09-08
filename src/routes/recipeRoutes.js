import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";
import { RecipeController } from "../controllers/RecipeController.js";

const router = Router();
const recipeController = new RecipeController();

router.get("/", recipeController.findAllRecipes);
router.get("/me", authenticate, recipeController.findRecipeByUser);
router.get("/:recipeId", recipeController.findRecipe);
router.post("/", authenticate, upload.single("image"), recipeController.createRecipe);
router.put("/:recipeId", authenticate, upload.single("image"), recipeController.updateRecipe);
router.delete("/:recipeId", authenticate, recipeController.deleteRecipe);

export default router;
