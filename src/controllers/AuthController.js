import { AuthRepository } from "../repositories/AuthRepository.js";
import { AuthService } from "../services/AuthService.js";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

export class AuthController {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const result = await authService.login(email, password);

      return res.status(200).json(result);
    } catch (error) {
      if (error.message === "USER_NOT_FOUND" || error.message === "INVALID_CREDENTIALS") {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async requestPasswordReset(req, res) {
    const { email } = req.body;

    try {
      const result = await authService.requestPasswordReset(email);

      return res.json(result);
    } catch (error) {
      if (error.message === "USER_NOT_FOUND") return res.status(404).json({ error: "Usuário não encontrado" });
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async resetPassword(req, res) {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      const result = await authService.resetPassword(token, newPassword);

      return res.json(result);
    } catch (error) {
      if (error.message === "INVALID_TOKEN") return res.status(400).json({ error: "Token inválido ou expirado" });
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
