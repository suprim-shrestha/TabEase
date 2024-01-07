export interface IGroup {
  id: number;
  name: string;
  createdBy: number;
}

export interface ICreateGroup extends Omit<IGroup, "id"> {}

export interface IUpdateGroup extends Partial<IGroup> {
  updatedAt: Date;
}
