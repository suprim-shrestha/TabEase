import { NextFunction, Request, Response } from "express";

import * as authService from "../services/auth.service";
import { UnauthorizedException } from "../exceptions";
import { setCookies } from "../utils/cookie.util";

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
    const { accessToken, refreshToken } = await authService.login(body);

    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.json({
    message: "User logged out successfully",
  });
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.signedCookies.refreshToken;

    if (!token) {
      throw new UnauthorizedException("No token");
    }

    const { accessToken, refreshToken } = await authService.refresh(token);

    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}
