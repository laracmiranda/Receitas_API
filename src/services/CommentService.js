import { paginate } from "../../utils/pagination.js";

export class CommentService {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async getCommentsByRecipe(recipeId, { page = 1, limit = 8, sort = "desc" }) {
    const model = {
      findMany: (params) => this.commentRepository.findAll(params),
      count: (where) => this.commentRepository.count(where),
    };

    return paginate(model, {
      where: { recipeId },
      page,
      limit,
      orderBy: { creationDate: sort },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async createComment({ content, recipeId, userId }) {
    return this.commentRepository.create({ content, recipeId, userId });
  }

  async deleteComment(id, userId) {
    const comment = await this.commentRepository.findUnique(id);
    
    if (!comment) throw new Error("NOT_FOUND");
    if (comment.userId !== userId) throw new Error("FORBIDDEN");

    return this.commentRepository.delete(id);
  }
}
