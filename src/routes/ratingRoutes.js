import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { RatingController } from "../controllers/RatingController.js";

const router = Router();
const ratingController = new RatingController();

router.post("/:recipeId", authenticate, ratingController.rateRecipe);
router.get("/:recipeId", ratingController.getRecipeRating);

export default router;
