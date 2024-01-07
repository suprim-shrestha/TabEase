import { NotFoundException } from "../exceptions";
import { ICreateGroup, IUpdateGroup } from "../interfaces/group.interface";
import GroupModel from "../models/group.model";

export async function createGroup(newGroup: ICreateGroup) {
  return GroupModel.createGroup(newGroup);
}

export async function getGroups(userId: number) {
  const groups = await GroupModel.getGroups(userId);

  return {
    data: groups,
  };
}

export async function getGroupById(id: number, userId: number) {
  const group = await GroupModel.getGroupById(id, userId);

  if (!group) {
    throw new NotFoundException(`Group with id ${id} Not Found`);
  }

  return group;
}

export async function updateGroup(
  id: number,
  userId: number,
  groupDetails: IUpdateGroup
) {
  const group = await GroupModel.getGroupById(id, userId);

  if (!group) {
    throw new NotFoundException(`Group with id ${id} Not Found`);
  }

  await GroupModel.updateGroup(id, groupDetails);

  return await GroupModel.getGroupById(id, userId);
}

export async function deleteGroup(id: number, userId: number) {
  const group = await GroupModel.getGroupById(id, userId);

  if (!group) {
    throw new NotFoundException(`Group with id ${id} Not Found`);
  }

  await GroupModel.deleteGroup(id);
}
