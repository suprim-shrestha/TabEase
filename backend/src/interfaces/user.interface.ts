export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
}

export interface ICreateUser extends Omit<IUser, "id"> {}

export interface IUpdateUser extends Partial<IUser> {}
