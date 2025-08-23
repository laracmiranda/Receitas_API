import { prismaClient } from "../../database/PrismaClient.js";

export class FavoriteController {

    async findFavorites(req, res){
        const userId = req.userId;

        try {
            const favorites = await prismaClient.favorite.findMany({
                where: { userId },
                orderBy: { creationDate: "desc" },
                include: {
                    recipe: true
                }
            });

            return res.status(200).json(favorites);
        } catch (error){
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar receitas favoritadas" });
        }
    }

    async addFavorite(req, res){
          const { recipeId } = req.params;
          const userId = req.userId;

          // Verificar se já não está favoritada
          const alreadyExists = await prismaClient.favorite.findUnique({
            where: { userId_recipeId: { userId, recipeId }}
          });

          if (alreadyExists) {
            return res.status(400).json({ error: "Receita já está nos favoritos" });
          }

          try {
              const favorite = await prismaClient.favorite.create({
                data: { recipeId, userId },
              });

              return res.status(201).json(favorite);
          } catch (error){
            return res.status(500).json({ error: "Erro ao adicionar favorito" });
          }
    }

    async deleteFavorite(req, res){
        const { id } = req.params;
        const userId = req.userId;

        try {
            const favorite = await prismaClient.favorite.findUnique({ where : { id } });

            if (!favorite){
                return res.status(404).json({ error: "Favorito não encontrado "});
            }

            if (favorite.userId !== userId) {
                return res.status(403).json({ error: "Não autorizado" });
            }

            await prismaClient.favorite.delete({ where: { id } });

            return res.status(200).json({ message: "Receita removida dos favoritos"});
        } catch(error){
            console.error(error);
            return res.status(403).json({ error: "Erro ao remover favorito" });
        }
    }

}