import { useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { login as loginSvc, logout as logoutSvc, listenToAuthState, registerUser, saveUserRole } from "@/features/auth/services/auth.service";

import { AuthContext } from "@/types/authContext.type"; // 👈 importas el contexto definido en types
import { useNavigate } from "react-router-dom";
import type { AppUser } from "@/types/AppUser";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listener de Firebase
  useEffect(() => {
    const unsub = listenToAuthState((u) => {
      setUser(u);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await loginSvc(email, password);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, role: AppUser["role"]) => {
    setIsLoading(true);
    try {
      const cred = await registerUser(email, password);
      const uid = cred.user.uid;
      await saveUserRole(uid, role);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutSvc();
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const value = useMemo(() => ({ user, isLoading, login, register, logout }), [user, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
