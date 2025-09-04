import { prismaClient } from "../../database/PrismaClient.js";

export class AuthRepository {
  async findUserByEmail(email) {
    return prismaClient.user.findUnique({ where: { email } });
  }

  async createResetToken(userId, token, expiresAt) {
    return prismaClient.resetPasswordToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async findResetToken(token) {
    return prismaClient.resetPasswordToken.findUnique({ where: { token } });
  }

  async deleteResetToken(id) {
    return prismaClient.resetPasswordToken.delete({ where: { id } });
  }

  async updateUserPassword(userId, hashedPassword) {
    return prismaClient.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
