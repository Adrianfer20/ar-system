// Solo TIPOS + el Contexto vacío
import { createContext } from "react";
import type { AppUser } from "./AppUser";

export interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Contexto inicial, sin implementación
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
