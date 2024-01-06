import { NextFunction, Request, Response } from "express";

import * as authService from "../services/auth.service";

export async function signup(req: Request, res: Response, next: NextFunction) {
  const { body } = req;

  try {
    const data = await authService.signup(body);

    return res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const { body } = req;

  try {
    const data = await authService.login(body);

    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}
