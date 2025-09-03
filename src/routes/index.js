import { Router } from "express";
import userRoutes from "./userRoutes.js";
import recipeRoutes from "./recipeRoutes.js";
import authRoutes from "./authRoutes.js";

const router = Router();

router.use('/users', userRoutes);
router.use('/recipes', recipeRoutes);
router.use('/auth', authRoutes);

export default router;
