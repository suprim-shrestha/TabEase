import { Router } from "express";

import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import groupRoutes from "./group.route";
import linkRoutes from "./link.route";

import { auth } from "../middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/groups", auth, groupRoutes);
router.use("/links", auth, linkRoutes);

export default router;
