import { formatPrepTime } from "./formatTime.js";

export function formatRecipe(recipe) {
  
  return {
    id: recipe.id,
    name: recipe.name,
    category: recipe.category,
    description: recipe.description,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    prepTime: formatPrepTime(recipe.prepTime),
    difficulty: recipe.difficulty,
    portions: recipe.portions,
    status: recipe.status,
    creationDate: recipe.creationDate,
    image: recipe.image,
    user: recipe.user,
    likes: recipe._count?.favorites ?? 0,
    ratingCount: recipe.ratingCount ?? 0,
    ratingAvg: recipe.ratingAvg ?? null,
  };
}
