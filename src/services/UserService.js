import bcrypt from "bcryptjs";

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id) {
    const user = await this.userRepository.findUnique({ id });
    if (!user) throw new Error("NOT_FOUND");
    return user;
  }

  async getAuthenticatedUser(userId) {
    const user = await this.userRepository.findUnique({ id: userId });
    if (!user) throw new Error("NOT_FOUND");
    return user;
  }

  async createUser({ name, email, password }) {
    const existingUser = await this.userRepository.findUnique({ email });
    if (existingUser) throw new Error("EMAIL_IN_USE");

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.create({ name, email, password: hashedPassword });
  }

  async updateUser(userId, { name, email }) {
    const user = await this.userRepository.findUnique({ id: userId });
    if (!user) throw new Error("NOT_FOUND");

    const emailExists = await this.userRepository.findUnique({ email });
    if (emailExists && emailExists.id !== userId) throw new Error("EMAIL_IN_USE");

    return this.userRepository.update(userId, { name, email });
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await this.userRepository.findUnique({ id: userId });
    if (!user) throw new Error("NOT_FOUND");

    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) throw new Error("INVALID_PASSWORD");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });

    return { message: "Senha atualizada com sucesso!" };
  }

  async deleteUser(userId) {
    const user = await this.userRepository.findUnique({ id: userId });
    if (!user) throw new Error("NOT_FOUND");

    return this.userRepository.delete(userId);
  }
}
