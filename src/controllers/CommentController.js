import { CommentRepository } from "../repositories/CommentRepository.js";
import { CommentService } from "../services/CommentService.js";

const commentRepository = new CommentRepository();
const commentService = new CommentService(commentRepository);

export class CommentController {
  async findCommentsByRecipe(req, res, next) {
    try {
      const { recipeId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const sort = req.query.sort || "desc";

      const comments = await commentService.getCommentsByRecipe(recipeId, { page, limit, sort });
      
      return res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  }

  async createComment(req, res, next) {
    try {
      const userId = req.userId;
      const { content } = req.body;
      const { recipeId } = req.params;

      const comment = await commentService.createComment({ content, recipeId, userId });

      return res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      await commentService.deleteComment(id, userId);

      return res.status(200).json({ message: "Comentário deletado com sucesso" });
    } catch (error) {
      next(error);
    }
  }
}
