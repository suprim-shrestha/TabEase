import { Router } from "express";

import { signup, login } from "../controllers/auth.controller";

import { validateReqBody } from "../middlewares/validator.middleware";
import { loginSchema, signupSchema } from "../schemas/auth.schema";

const router = Router();

router.post("/signup", validateReqBody(signupSchema), signup);

router.post("/login", validateReqBody(loginSchema), login);

export default router;
