import { paginate } from "../../utils/pagination.js";
import { NotFoundError, ForbiddenError, ValidationError } from "../errors/AppError.js";
import { RecipeRepository } from "../repositories/RecipeRepository.js";

export class CommentService {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
    this.recipeRepository = new RecipeRepository();
  }

  async getCommentsByRecipe(recipeId, { page = 1, limit = 8, sort = "desc" }) {
    const recipe = await this.recipeRepository.findUnique(recipeId);
    if (!recipe) throw new NotFoundError("Receita não encontrada");

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
    if (!content) throw new ValidationError("Comentário não pode estar vazio");

    return this.commentRepository.create({ content, recipeId, userId });
  }

  async deleteComment(id, userId) {
    const comment = await this.commentRepository.findUnique(id);

    if (!comment) throw new NotFoundError("Comentário não encontrado");
    if (comment.userId !== userId) throw new ForbiddenError("Você não pode deletar esse comentário");

    return this.commentRepository.delete(id);
  }
}
