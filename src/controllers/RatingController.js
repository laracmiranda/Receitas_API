import { RatingRepository } from "../repositories/RatingRepository.js";
import { RecipeRepository } from "../repositories/RecipeRepository.js";
import { RatingService } from "../services/RatingService.js";

const ratingRepository = new RatingRepository();
const recipeRepository = new RecipeRepository();
const ratingService = new RatingService(ratingRepository, recipeRepository);

export class RatingController {
    rateRecipe = async (req, res, next) => {
        try {
        const userId = req.userId;
        const { recipeId } = req.params;
        const { value } = req.body;

        const rating = await ratingService.rateRecipe(userId, recipeId, value);
        return res.status(200).json(rating);
        } catch (error) {
        next(error);
        }
    };

    getRecipeRating = async (req, res, next) => {
        try {
        const { recipeId } = req.params;
        const rating = await ratingService.getRecipeRating(recipeId);
        return res.status(200).json(rating);
        } catch (error) {
        next(error);
        }
    };
}
