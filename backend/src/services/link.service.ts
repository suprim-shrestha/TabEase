import { NotFoundException } from "../exceptions";
import { ICreateLink, IUpdateLink } from "../interfaces/link.interface";
import LinkModel from "../models/link.model";

export async function createLink(newLink: ICreateLink) {
  return LinkModel.createLink(newLink);
}

export async function getLinks(groupId: number) {
  const links = await LinkModel.getLinks(groupId);

  return {
    data: links,
  };
}

export async function getLinkById(id: number, groupId: number) {
  const link = await LinkModel.getLinkById(id, groupId);

  if (!link) {
    throw new NotFoundException(`Link with id ${id} Not Found`);
  }

  return link;
}

export async function updateLink(
  id: number,
  groupId: number,
  linkDetails: IUpdateLink
) {
  const link = await LinkModel.getLinkById(id, groupId);

  if (!link) {
    throw new NotFoundException(`Link with id ${id} Not Found`);
  }

  await LinkModel.updateLink(id, linkDetails);

  return await LinkModel.getLinkById(id, groupId);
}

export async function deleteLink(id: number, groupId: number) {
  const link = await LinkModel.getLinkById(id, groupId);

  if (!link) {
    throw new NotFoundException(`Link with id ${id} Not Found`);
  }

  await LinkModel.deleteLink(id);
}

export async function deleteAllLinks(groupId: number) {
  await LinkModel.deleteAllLinks(groupId);
}
