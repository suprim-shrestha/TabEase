import { NextFunction, Request, Response } from "express";

import * as userService from "../services/user.service";
import { IUpdateUser } from "../interfaces/user.interface";

export async function getUsers(_req: Request, res: Response) {
  const data = await userService.getUsers();

  return res.json({
    data,
  });
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;

    const data = await userService.getUserById(parseInt(id));

    return res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;
    const userDetails: IUpdateUser = req.body;

    const data = await userService.updateUser(parseInt(id), userDetails);

    return res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id;

    await userService.deleteUser(parseInt(id));

    return res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
