import bcrypt from "bcryptjs";
import { NotFoundError, ConflictError, UnauthorizedError } from "../errors/AppError.js";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id) {
    const user = await this.userRepository.findUnique({ id });
    if (!user) throw new NotFoundError("Usuário não encontrado");
    return user;
  }

  async getAuthenticatedUser(userId) {
    const user = await this.userRepository.findUnique({ id: userId });
    if (!user) throw new NotFoundError("Usuário não encontrado");
    return user;
  }

  async createUser({ name, email, password }) {
    const existingUser = await this.userRepository.findUnique({ email });
    if (existingUser) throw new ConflictError("Email já está em uso");

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepository.create({ name, email, password: hashedPassword });
  }

  async updateUser(userId, { name, email }) {
    const user = await this.userRepository.findUnique({ id: userId });
    if (!user) throw new NotFoundError("Usuário não encontrado");

    if (email !== user.email) {
      const emailExists = await this.userRepository.findUnique({ email });
      if (emailExists && emailExists.id !== userId) throw new ConflictError("Email já está em uso");
    }

    return this.userRepository.update(userId, { name, email });
  }

  async updateBio(userId, bio){
    const user = await this.userRepository.findUnique({ id: userId });
    if (!user) throw new NotFoundError("Usuário não encontrado");

    return this.userRepository.updateBio(userId, bio);
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.userRepository.findUserWithPassword({ id: userId });
    if (!user) throw new NotFoundError("Usuário não encontrado");

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) throw new UnauthorizedError("Senha atual incorreta");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });

    return { message: "Senha atualizada com sucesso!" };
  }

  async deleteUser(userId) {
    const user = await this.userRepository.findUnique({ id: userId });
    if (!user) throw new NotFoundError("Usuário não encontrado");

    return this.userRepository.delete(userId);
  }
}
