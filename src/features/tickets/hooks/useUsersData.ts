import { useEffect, useState } from "react";
import type { User } from "@/types/User.type";
import { useUsersApi } from "@/hooks/useUserApi";

export function useUsersData() {
  const { getUsers } = useUsersApi();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        setUsers(await getUsers());
      } catch (err: any) {
        setError(err.message || "Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    })();
  }, [getUsers]);

  return { users, loading, error };
}
