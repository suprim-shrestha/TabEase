import { ICreateUser, IUpdateUser } from "../interfaces/user.interface";
import BaseModel from "./base.model";

export default class UserModel extends BaseModel {
  static async getUsers() {
    return this.queryBuilder()
      .select({
        id: "id",
        username: "username",
        email: "email",
      })
      .from("users");
  }

  static async getUserById(id: number) {
    return this.queryBuilder()
      .select({
        id: "id",
        username: "username",
        email: "email",
      })
      .from("users")
      .where({ id })
      .first();
  }

  static async getUserByEmail(email: string) {
    const user = await this.queryBuilder()
      .select({
        id: "id",
        username: "username",
        email: "email",
        password: "password",
      })
      .from("users")
      .where({ email })
      .first();

    return user?.[0];
  }

  static async createUser(user: ICreateUser) {
    return this.queryBuilder().insert(user).table("users");
  }

  static async updateUser(id: number, user: IUpdateUser) {
    return this.queryBuilder().update(user).table("users").where({ id });
  }

  static async deleteUser(id: number) {
    return this.queryBuilder().table("users").where({ id }).del();
  }
}
