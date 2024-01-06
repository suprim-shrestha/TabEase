import { Router } from "express";

import userRoutes from "./user.route";
import authRoutes from "./auth.route";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);

export default router;
