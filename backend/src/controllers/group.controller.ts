import { NextFunction, Request, Response } from "express";

import { JwtPayload } from "../interfaces/jwt.interface";
import * as groupService from "../services/group.service";
import { ICreateGroup, IUpdateGroup } from "../interfaces/group.interface";

export async function createGroup(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const { name } = req.body;

    const newGroup: ICreateGroup = {
      name,
      createdBy: user.id,
    };

    await groupService.createGroup(newGroup);

    res.json({
      message: "Group created successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getGroups(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;

    const groups = await groupService.getGroups(user.id);

    res.json(groups);
  } catch (error) {
    next(error);
  }
}

export async function getGroupById(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const { id } = req.params;

    const group = await groupService.getGroupById(parseInt(id), user.id);

    res.json(group);
  } catch (error) {
    next(error);
  }
}

export async function updateGroup(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const { id } = req.params;

    const groupDetails: IUpdateGroup = {
      ...req.body,
      updatedAt: new Date(),
    };

    const updatedGroup = await groupService.updateGroup(
      parseInt(id),
      user.id,
      groupDetails
    );

    res.json(updatedGroup);
  } catch (error) {
    next(error);
  }
}

export async function deleteGroup(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const { id } = req.params;

    await groupService.deleteGroup(parseInt(id), user.id);

    res.json({
      message: "Group deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
