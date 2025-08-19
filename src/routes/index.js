import express from "express";
import { UserController } from "../controllers/UserController.js";

const router = express.Router();

const userController = new UserController();

// User routes
router.get("/users", userController.findAllUsers);
router.get("/user/:id", userController.findUser);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

export { router }