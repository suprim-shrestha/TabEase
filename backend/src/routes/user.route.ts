import { Router } from "express";

import {
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  getCurrentUser,
} from "../controllers/user.controller";
import { auth } from "../middlewares/auth.middleware";

import { validateReqBody } from "../middlewares/validator.middleware";
import { updateUserSchema } from "../schemas/user.schema";

const router = Router();

router.get("/", getUsers);

router.get("/me", auth, getCurrentUser);

router.get("/:id", getUserById);

router.put("/:id", validateReqBody(updateUserSchema), updateUser);

router.delete("/:id", deleteUser);

export default router;
