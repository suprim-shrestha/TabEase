export interface IGroup {
  id: number;
  name: string;
  createdBy: number;
}

export interface ICreateGroup {
  name: string;
}

export interface IGroupSchema {
  groupName: string;
}
