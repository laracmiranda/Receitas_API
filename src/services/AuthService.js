import bcrypt from "bcryptjs";
import { prismaClient } from "../../database/PrismaClient.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendMail } from "../../config/mailer.js";
import { NotFoundError, UnauthorizedError, BadRequestError } from "../errors/AppError.js";

const PORT = process.env.PORT || 3000;

export class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async login(email, password) {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) throw new UnauthorizedError("Credenciais inválidas");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedError("Credenciais inválidas");

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '1h' });

    return {
      token,
      user: { id: user.id, name: user.name },
    };
  }

  async requestPasswordReset(email) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) throw new NotFoundError("Usuário não encontrado");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutos

    await this.authRepository.createResetToken(user.id, resetToken, expiresAt);

    await sendMail(
      user.email,
      "Redefinição de senha",
      `
      <h2>Olá, ${user.name}</h2>
      <p>Você solicitou redefinição de senha. Clique no link abaixo para redefinir:</p>
      <a href="http://localhost:${PORT}/reset-password/${resetToken}">👉 Redefinir minha senha</a>
      <p>Esse link expira em 15 minutos.</p>
      `
    );

    return { message: "E-mail de redefinição enviado!" };
  }

  async resetPassword(token, newPassword) {
    const resetToken = await this.authRepository.findResetToken(token);
    if (!resetToken || resetToken.expiresAt < new Date())
      throw new BadRequestError("Token inválido ou expirado");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.authRepository.updatePassword(resetToken.userId, hashedPassword);
    await this.authRepository.deleteResetToken(resetToken.id);

    return { message: "Senha redefinida com sucesso!" };
  }
}
