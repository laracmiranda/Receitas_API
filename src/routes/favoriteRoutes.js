import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { FavoriteController } from "../controllers/FavoriteController.js";

const router = Router();
const favoriteController = new FavoriteController();

router.get("/", authenticate, favoriteController.findFavorites);
router.post("/:recipeId", authenticate, favoriteController.addFavorite);
router.delete("/:recipeId", authenticate, favoriteController.deleteFavorite);

export default router;
