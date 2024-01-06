import { IUpdateUser } from "../interfaces/user.interface";
import UserModel from "../models/user.model";

export async function getUsers() {
  return await UserModel.getUsers();
}

export async function getUserById(id: number) {
  return await UserModel.getUserById(id);
}

export async function updateUser(id: number, updatedInfo: IUpdateUser) {
  return await UserModel.updateUser(id, updatedInfo);
}

export async function deleteUser(id: number) {
  return await UserModel.deleteUser(id);
}
