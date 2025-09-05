import { AuthRepository } from "../repositories/AuthRepository.js";
import { AuthService } from "../services/AuthService.js";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

export class AuthController {
  login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const result = await authService.login(email, password);
      
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  requestPasswordReset = async (req, res, next) => {
    const { email } = req.body;
    try {
      const result = await authService.requestPasswordReset(email);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
      const result = await authService.resetPassword(token, newPassword);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
