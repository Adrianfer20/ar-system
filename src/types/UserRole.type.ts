import type { User } from "./User.type";

export interface UserRole extends User {
  password: string;
  role: string;
}