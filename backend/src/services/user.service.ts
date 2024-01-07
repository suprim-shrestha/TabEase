import bcrypt from "bcrypt";

import { NotFoundException } from "../exceptions";
import { IUpdateUser } from "../interfaces/user.interface";
import UserModel from "../models/user.model";
import config from "../config";

export async function getUsers() {
  return await UserModel.getUsers();
}

export async function getUserById(id: number) {
  const user = await UserModel.getUserById(id);

  if (!user) {
    throw new NotFoundException("User Not Found");
  }

  return user;
}

export async function updateUser(id: number, userDetails: IUpdateUser) {
  const user = await UserModel.getUserById(id);

  if (!user) {
    throw new NotFoundException("User Not Found");
  }

  if (userDetails.password) {
    userDetails.password = await bcrypt.hash(
      userDetails.password,
      config.saltRounds
    );
  }

  await UserModel.updateUser(id, userDetails);

  const updatedUser = await UserModel.getUserById(id);

  return updatedUser;
}

export async function deleteUser(id: number) {
  const user = await UserModel.getUserById(id);

  if (!user) {
    throw new NotFoundException("User Not Found");
  }

  await UserModel.deleteUser(id);
}
