import { CookieOptions, Response } from "express";
import config from "../config";

const COOKIE_ACCESS_KEY = "accessToken";
const COOKIE_REFRESH_KEY = "refreshToken";

const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  signed: true,
  maxAge: config.cookie.maxAge,
  domain: config.backendUrl,
  sameSite: "strict",
};

export function setCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.cookie(COOKIE_ACCESS_KEY, accessToken, defaultCookieOptions);

  res.cookie(COOKIE_REFRESH_KEY, refreshToken, {
    ...defaultCookieOptions,
    maxAge: config.cookie.refreshMaxAge,
  });
}
