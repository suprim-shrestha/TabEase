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
    const result = await authService.login(body);

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      signed: true,
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("accessToken");

  return res.json({
    message: "User logged out successfully",
  });
}
