import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions";

/**
 * Error handler middleware
 *
 * @param error
 * @param request
 * @param response
 * @param next
 */
export async function errorHandler(
  error: HttpException,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  const { statusCode, message } = error;

  if (res.headersSent) {
    return next(error);
  }

  return res.status(statusCode || 500).json({
    error: message || "Something went wrong!",
  });
}

/**
 * Error response middleware for 404 not found. This middleware function should be at the very bottom of the stack.
 *
 */
export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json({
    error: "Not Found!",
  });
}
