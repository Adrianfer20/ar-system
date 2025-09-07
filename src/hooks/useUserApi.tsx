// hooks/useUsersApi.ts
import { apiRequest } from "@/lib/api.service";
import type { Role } from "@/types/Role";
import type { User } from "@/types/User.type";
import { useCallback, useState } from "react";

interface CreateUserPayload {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  tlfn: string;
  role: Role;
}

// hooks/useUsersApi.ts
export function useUsersApi() {
  const [loading, setLoading] = useState(false);

  const getUsers = useCallback(async (): Promise<User[]> => {
    setLoading(true);
    try {
      return await apiRequest<User[]>("/users");
    } finally {
      setLoading(false);
    }
  }, []);

  const getUser = async (userName: string): Promise<User | null> => {
    setLoading(true);
    try {
      return await apiRequest<User>(`/users/${userName}`);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: CreateUserPayload) => {
    setLoading(true);
    try {
      return await apiRequest<User>("/users", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } finally {
      setLoading(false);
    }
  };

  return { getUsers, getUser, createUser, loading };
}
