import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();
const userController = new UserController();

router.get("/", userController.findAllUsers);
router.get("/me", authenticate, userController.findUserAuthenticated);
router.get("/:userId", userController.findUser);
router.post("/", userController.createUser);
router.put("/me", authenticate, userController.updateUser);
router.patch("/me/bio", authenticate, userController.updateBio);
router.delete("/me", authenticate, userController.deleteUser);
router.patch("/me/change-password", authenticate, userController.changePassword);

export default router;
