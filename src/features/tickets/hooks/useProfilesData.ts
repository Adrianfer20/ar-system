import { useProfilesApi, type Profile } from "@/hooks/useProfilesApi";
import { useEffect, useState } from "react";

export function useProfilesData(userName: string) {
  const { getProfiles } = useProfilesApi();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userName) {
      setProfiles([]);
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        setProfiles(await getProfiles(userName));
      } catch (err: any) {
        setError(err.message || "Error al cargar perfiles");
      } finally {
        setLoading(false);
      }
    })();
  }, [userName, getProfiles]);

  return { profiles, loading, error };
}
