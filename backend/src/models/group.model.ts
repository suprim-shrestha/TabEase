import BaseModel from "./base.model";

import { ICreateGroup, IUpdateGroup } from "../interfaces/group.interface";

export default class GroupModel extends BaseModel {
  static async getGroups(userId: number) {
    return this.queryBuilder()
      .select({
        id: "id",
        name: "name",
        createdBy: "created_by",
      })
      .from("groups")
      .where({ createdBy: userId });
  }

  static async getGroupById(id: number, userId: number) {
    return this.queryBuilder()
      .select({
        id: "id",
        name: "name",
        createdBy: "created_by",
      })
      .from("groups")
      .where({ id, createdBy: userId })
      .first();
  }

  static async createGroup(group: ICreateGroup) {
    return this.queryBuilder().insert(group).table("groups");
  }

  static async updateGroup(id: number, group: IUpdateGroup) {
    return this.queryBuilder().update(group).table("groups").where({ id });
  }

  static async deleteGroup(id: number) {
    return this.queryBuilder().table("groups").where({ id }).del();
  }
}
