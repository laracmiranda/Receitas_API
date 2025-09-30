import { UserRepository } from "../repositories/UserRepository.js";
import { UserService } from "../services/UserService.js";
import { createUserSchema, updateUserSchema, changePasswordSchema, updateBioSchema } from "../validators/userValidator.js";
import { ValidationError } from "../errors/AppError.js";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
  findAllUsers = async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  findUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await userService.getUserById(userId);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  findUserAuthenticated = async (req, res, next) => {
    try {
      const user = await userService.getAuthenticatedUser(req.userId);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req, res, next) => {
    const { error } = createUserSchema.validate(req.body);
    if (error) return next(new ValidationError(error.details[0].message));

    try {
      const { name, email, password } = req.body;
      const user = await userService.createUser({ name, email, password });
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    const { error } = updateUserSchema.validate(req.body);
    if (error) return next(new ValidationError(error.details[0].message));

    try {
      const updatedUser = await userService.updateUser(req.userId, req.body);
      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  updateBio = async (req, res, next) => {
    const { error } = updateBioSchema.validate(req.body);
    if (error) return next(new ValidationError(error.details[0].message));
    try {
      const { bio } = req.body;
      const updatedUser = await userService.updateBio(req.userId, bio);
      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req, res, next) => {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) return next(new ValidationError(error.details[0].message));

    try {
      const { currentPassword, newPassword } = req.body;
      const result = await userService.changePassword(req.userId, currentPassword, newPassword);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      await userService.deleteUser(req.userId);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
