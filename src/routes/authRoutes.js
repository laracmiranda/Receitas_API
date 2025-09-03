import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

const router = Router();
const authController = new AuthController();

// Rotas de Autenticação
router.post("/login", authController.login);
router.post("/request-reset", authController.requestPasswordReset);
router.post("/reset-password/:token", authController.resetPassword);

export default router;
