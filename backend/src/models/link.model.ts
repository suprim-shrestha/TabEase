import BaseModel from "./base.model";

import { ICreateLink, IUpdateLink } from "../interfaces/link.interface";

export default class LinkModel extends BaseModel {
  static async getLinks(groupId: number) {
    return this.queryBuilder()
      .select({
        id: "id",
        title: "title",
        url: "url",
        belongsTo: "belongs_to",
      })
      .from("links")
      .where({ belongsTo: groupId })
      .orderBy("created_at");
  }

  static async getLinkById(id: number, groupId: number) {
    return this.queryBuilder()
      .select({
        id: "id",
        title: "title",
        url: "url",
        belongsTo: "belongs_to",
      })
      .from("links")
      .where({ id, belongsTo: groupId })
      .first();
  }

  static async createLink(link: ICreateLink) {
    return this.queryBuilder().insert(link).table("links");
  }

  static async updateLink(id: number, link: IUpdateLink) {
    return this.queryBuilder().update(link).table("links").where({ id });
  }

  static async deleteLink(id: number) {
    return this.queryBuilder().table("links").where({ id }).del();
  }
}
