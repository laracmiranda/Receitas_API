import { CommentRepository } from "../repositories/CommentRepository.js";
import { CommentService } from "../services/CommentService.js";

const commentRepository = new CommentRepository();
const commentService = new CommentService(commentRepository);

export class CommentController {
  async findCommentsByRecipe(req, res) {
    try {
      const { recipeId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const sort = req.query.sort || "desc";

      const comments = await commentService.getCommentsByRecipe(recipeId, { page, limit, sort });
      
      return res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar comentários" });
    }
  }

  async createComment(req, res) {
    try {
      const userId = req.userId;
      const { content } = req.body;
      const { recipeId } = req.params;

      if (!content) return res.status(400).json({ error: "Comentário não pode estar vazio" });

      const comment = await commentService.createComment({ content, recipeId, userId });

      return res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar comentário" });
    }
  }

  async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      await commentService.deleteComment(id, userId);

      return res.status(200).json({ message: "Comentário deletado com sucesso" });
    } catch (error) {
      if (error.message === "NOT_FOUND") return res.status(404).json({ error: "Comentário não encontrado" });
      if (error.message === "FORBIDDEN") return res.status(403).json({ error: "Você não pode deletar esse comentário" });

      console.error(error);
      return res.status(500).json({ error: "Erro ao deletar comentário" });
    }
  }
}
