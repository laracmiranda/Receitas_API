import { formatPrepTime } from "../../utils/formatTime.js";
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

    const formattedData = data.map( r => ({
      ...r,
      prepTime: formatPrepTime(r.prepTime),
    }));

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: formattedData,
    };
  }

  async getRecipeById(id) {
    const recipe = await this.recipeRepository.findUnique(id);
    if (!recipe) throw new NotFoundError("Receita não encontrada");
    return {
      ...recipe,
      prepTime: formatPrepTime(recipe.prepTime),
    };
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

    const formattedData = data.map( r => ({
      ...r,
      prepTime: formatPrepTime(r.prepTime),
    }));

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: formattedData,
    };
  }

  async createRecipe({ name, category, ingredients, steps, prepTime, difficulty, description, portions, status, userId, file }) {
    let image = null;
    if (file && file.buffer) image = await uploadImageToCloudinary(file.buffer);

    return this.recipeRepository.create({
      name,
      category,
      ingredients,
      steps,
      prepTime,
      difficulty,
      description,
      portions,
      status,
      image,
      userId,
    });
  }

  async updateRecipe(id, userId, { name, category, ingredients, steps, prepTime, difficulty, description, portions, status, file }) {
    const recipe = await this.recipeRepository.findUnique(id);
    if (!recipe) throw new NotFoundError("Receita não encontrada");
    if (recipe.userId !== userId) throw new ForbiddenError("Você não tem permissão para editar esta receita");

    let image = recipe.image;
    if (file && file.buffer) image = await uploadImageToCloudinary(file.buffer);

    return this.recipeRepository.update(id, {
      name,
      category,
      ingredients,
      steps,
      prepTime,
      difficulty,
      description,
      portions,
      status,
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
