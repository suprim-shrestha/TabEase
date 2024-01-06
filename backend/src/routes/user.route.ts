import { Router } from "express";

import {
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} from "../controllers/user.controller";

import { validateReqBody } from "../middlewares/validator.middleware";
import { updateUserSchema } from "../schemas/user.schema";

const router = Router();

router.get("/", getUsers);

router.get("/:id", getUserById);

router.put("/:id", validateReqBody(updateUserSchema), updateUser);

router.delete("/:id", deleteUser);

export default router;
