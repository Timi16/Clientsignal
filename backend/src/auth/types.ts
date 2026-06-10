import { Request } from "express";
import { UserRole } from "../database/schema";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface RequestWithUser extends Request {
  user: AuthUser;
}
