import { Router } from "express";
import userRoutes from "./userRoutes.js";
import recipeRoutes from "./recipeRoutes.js";
import authRoutes from "./authRoutes.js";
import commentRoutes from "./commentRoutes.js";
import favoriteRoutes from "./favoriteRoutes.js";
import ratingRoutes from "./ratingRoutes.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/recipes', recipeRoutes);
router.use('/comments', commentRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/rating', ratingRoutes);

export default router;
