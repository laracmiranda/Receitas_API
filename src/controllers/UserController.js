import { UserRepository } from "../repositories/UserRepository.js";
import { UserService } from "../services/UserService.js";
import { createUserSchema, updateUserSchema, changePasswordSchema } from "../validators/userValidator.js";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
  async findAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json(users);
    } catch {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async findUser(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      return res.status(200).json(user);
    } catch (error) {
      if (error.message === "NOT_FOUND") return res.status(404).json({ error: "Usuário não encontrado" });
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async findUserAuthenticated(req, res) {
    try {
      const user = await userService.getAuthenticatedUser(req.userId);

      return res.status(200).json(user);
    } catch (error) {
      if (error.message === "NOT_FOUND") return res.status(404).json({ error: "Usuário não encontrado" });
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async createUser(req, res) {
    const { error } = createUserSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const { name, email, password } = req.body;
      const user = await userService.createUser({ name, email, password });

      return res.status(201).json(user);
    } catch (error) {
      if (error.message === "EMAIL_IN_USE") return res.status(409).json({ error: "Email já está em uso" });
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async updateUser(req, res) {
    const { error } = updateUserSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const updatedUser = await userService.updateUser(req.userId, req.body);

      return res.status(200).json(updatedUser);
    } catch (error) {
      if (error.message === "NOT_FOUND") return res.status(404).json({ error: "Usuário não encontrado" });
      if (error.message === "EMAIL_IN_USE") return res.status(409).json({ error: "Email já está em uso" });
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async changePassword(req, res) {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const { currentPassword, newPassword } = req.body;
      const result = await userService.changePassword(req.userId, currentPassword, newPassword);

      return res.status(200).json(result);
    } catch (error) {
      if (error.message === "NOT_FOUND") return res.status(404).json({ error: "Usuário não encontrado" });
      if (error.message === "INVALID_PASSWORD") return res.status(401).json({ error: "Senha atual incorreta" });
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.userId);
      
      return res.status(204).send();
    } catch (error) {
      if (error.message === "NOT_FOUND") return res.status(404).json({ error: "Usuário não encontrado" });
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
