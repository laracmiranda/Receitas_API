import { Router } from "express";
import authenticate from "../middlewares/authenticate.js";
import { CommentController } from "../controllers/CommentController.js";

const router = Router();
const commentController = new CommentController();

router.get("/:recipeId/", commentController.findCommentsByRecipe);
router.post("/:recipeId/", authenticate, commentController.createComment);
router.delete("/:commentId", authenticate, commentController.deleteComment);

export default router;
