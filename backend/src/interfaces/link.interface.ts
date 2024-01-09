export interface ILink {
  id: number;
  title: string;
  url: string;
  belongsTo: number;
}

export interface ICreateLink extends Omit<ILink, "id"> {}

export interface IUpdateLink extends Partial<ILink> {
  updatedAt: Date;
}

export interface ILinkQuery {
  groupId: number;
}
