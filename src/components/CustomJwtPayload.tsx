import type {JwtPayload} from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  sub: string;
  role: string;
  username: string;
  exp: number;
}