import { Router } from "express";

import { signup, login, logout, refresh } from "../controllers/auth.controller";

import { validateReqBody } from "../middlewares/validator.middleware";
import { loginSchema, signupSchema } from "../schemas/auth.schema";
import { auth } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", validateReqBody(signupSchema), signup);

router.post("/login", validateReqBody(loginSchema), login);

router.post("/logout", auth, logout);

router.post("/refresh", refresh);

export default router;
