import { JwtPayload as BaseJwtPayload } from "jsonwebtoken";

export interface JwtPayload extends BaseJwtPayload {
  id: number;
  username: string;
  email: string;
}
