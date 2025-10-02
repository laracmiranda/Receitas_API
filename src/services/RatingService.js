import { ValidationError, NotFoundError, ForbiddenError } from "../errors/AppError.js";

export class RatingService {
  constructor(ratingRepository, recipeRepository) {
    this.ratingRepository = ratingRepository;
    this.recipeRepository = recipeRepository;
  }

  async rateRecipe(userId, recipeId, value) {
    if (value < 1 || value > 5) throw new ValidationError("A avaliação deve ser entre 1 e 5");

    const recipe = await this.recipeRepository.findUnique(recipeId);
    if (!recipe) throw new NotFoundError("Receita não encontrada");

    const existingRating = await this.ratingRepository.findByUserAndRecipe(userId, recipeId);

    if (existingRating) {
      return this.ratingRepository.update(existingRating.id, { value });
    } else {
      return this.ratingRepository.create({ userId, recipeId, value });
    }
  }

  async getRecipeRating(recipeId) {
    return this.ratingRepository.getAverageByRecipe(recipeId);
  }
}
