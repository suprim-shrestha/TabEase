import { NextFunction, Request, Response } from "express";

import { JwtPayload } from "../interfaces/jwt.interface";
import * as linkService from "../services/link.service";
import {
  ICreateLink,
  ILinkQuery,
  IUpdateLink,
} from "../interfaces/link.interface";
import { getGroupById } from "../services/group.service";

export async function createLink(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const { title, url } = req.body;
    const { groupId } = req.query as unknown as ILinkQuery;

    await getGroupById(groupId, user.id);

    const newLink: ICreateLink = {
      title,
      url,
      belongsTo: groupId,
    };

    await linkService.createLink(newLink);

    res.json({
      message: "Link created successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getLinks(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const { groupId } = req.query as unknown as ILinkQuery;

    await getGroupById(groupId, user.id);

    const links = await linkService.getLinks(groupId);

    res.json(links);
  } catch (error) {
    next(error);
  }
}

export async function getLinkById(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { groupId } = req.query as unknown as ILinkQuery;

    await getGroupById(groupId, user.id);

    const link = await linkService.getLinkById(parseInt(id), groupId);

    res.json(link);
  } catch (error) {
    next(error);
  }
}

export async function updateLink(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { groupId } = req.query as unknown as ILinkQuery;

    await getGroupById(groupId, user.id);

    delete req.body.groupId;

    const linkDetails: IUpdateLink = {
      ...req.body,
      belongsTo: groupId,
      updatedAt: new Date(),
    };

    const updatedLink = await linkService.updateLink(
      parseInt(id),
      groupId,
      linkDetails
    );

    res.json(updatedLink);
  } catch (error) {
    next(error);
  }
}

export async function deleteLink(
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { groupId } = req.query as unknown as ILinkQuery;

    await getGroupById(groupId, user.id);

    await linkService.deleteLink(parseInt(id), groupId);

    res.json({
      message: "Link deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}
