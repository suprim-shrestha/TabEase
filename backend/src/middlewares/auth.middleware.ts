import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import config from "../config";
import { UnauthorizedException } from "../exceptions";
import { JwtPayload } from "../interfaces/jwt.interface";

export const auth = async (
  req: Request & { user?: JwtPayload },
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.signedCookies.accessToken;

    if (!token) {
      throw new UnauthorizedException("No access token");
    }

    const user = jwt.verify(token, config.jwt.accessTokenSecret!) as JwtPayload;

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
