// Retornar as receitas publicadas e total de likes nas receitas
export function formatUserWithStats(user) {
  if (!user) return null;

  const totalRecipes = user.recipes ? user.recipes.length : 0;
  const totalLikes = user.recipes
    ? user.recipes.reduce((acc, r) => acc + (r._count?.favorites || 0), 0)
    : 0;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio || null,
    totalRecipes,
    totalLikes
  };
}
