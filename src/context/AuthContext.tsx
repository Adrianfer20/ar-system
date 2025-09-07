import { useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { login as loginSvc, logout as logoutSvc, listenToAuthState } from "@/features/auth/services/auth.service";

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



  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutSvc();
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const value = useMemo(() => ({ user, isLoading, login, logout }), [user, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
