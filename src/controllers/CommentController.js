import { prismaClient } from "../../database/PrismaClient.js";
import { paginate } from "../../utils/pagination.js";

export class CommentController {

    async findCommentsByRecipe(req, res){
        const { recipeId } = req.params;

        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const sort = req.query.sort || "desc";

            const comments = await paginate(prismaClient.comment, {
                where: { recipeId },
                page,
                limit,
                orderBy: { creationDate: sort },
                include: {
                    user: { select: { id: true, name: true } }
                }
            });

            return res.status(200).json(comments);
        } catch (error){
            console.error(error);
            return res.status(500).json({ error: "Erro ao buscar comentários" });
        }
    }

    async createComment(req, res){
          const { content, recipeId } = req.body;
          const userId = req.userId;

          try {
              if (!content){
                return res.status(400).json({ error: "Comentário não pode estar vazio" });
              }
    
              const comment = await prismaClient.comment.create({
                data: { content, recipeId, userId },
                include: {
                    user: { select: { id: true, name: true } }
                }
              });
    
              return res.status(201).json(comment);
          } catch (error){
            return res.status(500).json({ error: "Erro ao criar comentário" });
          }
    }

    async deleteComment(req, res){
        const { id } = req.params;
        const userId = req.userId;

        try {
            const comment = await prismaClient.comment.findUnique({ where : { id } });

            if (!comment){
                return res.status(404).json({ error: "Comentário não encontrado "});
            }

            if (comment.userId !== userId) {
                return res.status(403).json({ error: "Você não pode deletar esse comentário" });
            }

            await prismaClient.comment.delete({ where: { id } });

            return res.status(200).json({ message: "Comentário deletado com sucesso"});
        } catch(error){
            console.error(error);
            return res.status(403).json({ error: "Erro ao deletar comentário" });
        }
    }

}