import { Router } from "express";

import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import groupRoutes from "./group.route";

import { auth } from "../middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/groups", auth, groupRoutes);

export default router;
