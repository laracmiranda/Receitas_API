import { uploadImageToCloudinary } from "../../utils/uploadImage.js";
import { ForbiddenError, NotFoundError,  } from "../errors/AppError.js";

export class RecipeService {
  constructor(recipeRepository) {
    this.recipeRepository = recipeRepository;
  }

  async getAllRecipes({ page = 1, limit = 10, orderBy = "creationDate", sort = "desc" }) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.recipeRepository.findAll({
        skip,
        take: limit,
        orderBy: { [orderBy]: sort },
        include: { user: { select: { id: true, name: true } } },
      }),
      this.recipeRepository.count({}),
    ]);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  async getRecipeById(id) {
    const recipe = await this.recipeRepository.findUnique(id);
    if (!recipe) throw new NotFoundError("Receita não encontrada");
    return recipe;
  }

  async getRecipesByUser(userId, { page = 1, limit = 10, sort = "desc" }) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.recipeRepository.findAll({
        where: { userId },
        skip,
        take: limit,
        orderBy: { creationDate: sort },
        include: { user: { select: { id: true, name: true } } },
      }),
      this.recipeRepository.count({ userId }),
    ]);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  async createRecipe({ name, category, ingredients, steps, userId, file }) {
    let formattedIngredients = ingredients;
    if (typeof ingredients === "string") {
      formattedIngredients = ingredients.split(",").map((i) => i.trim());
    }

    let image = null;
    if (file && file.buffer) {
      image = await uploadImageToCloudinary(file.buffer);
    }

    return this.recipeRepository.create({
      name,
      category,
      ingredients: formattedIngredients,
      steps,
      image,
      userId,
    });
  }

  async updateRecipe(id, userId, { name, category, ingredients, steps, file }) {
    const recipe = await this.recipeRepository.findUnique(id);
    if (!recipe) throw new NotFoundError("Receita não encontrada");
    if (recipe.userId !== userId) throw new ForbiddenError("Você não tem permissão para editar esta receita");

    let formattedIngredients = ingredients;
    if (typeof ingredients === "string") {
      formattedIngredients = ingredients.split(",").map((i) => i.trim());
    }

    let image = recipe.image;
    if (file && file.buffer) {
      image = await uploadImageToCloudinary(file.buffer);
    }

    return this.recipeRepository.update(id, {
      name,
      category,
      ingredients: formattedIngredients,
      steps,
      image,
    });
  }

  async deleteRecipe(id, userId) {
    const recipe = await this.recipeRepository.findUnique(id);
    if (!recipe) throw new NotFoundError("Receita não encontrada");
    if (recipe.userId !== userId) throw new ForbiddenError("Você não tem permissão para excluir esta receita");

    return this.recipeRepository.delete(id);
  }
}
