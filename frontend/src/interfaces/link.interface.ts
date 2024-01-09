export interface ILink {
  id: number;
  title: string;
  url: string;
  belongsTo: number;
}

export interface ICreateLink {
  title: string;
  url: string;
}
