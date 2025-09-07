import type { Role } from "./Role";

export type AppUser = {
uid: string;
email: string | null;
displayName: string | null;
role: Role;
};