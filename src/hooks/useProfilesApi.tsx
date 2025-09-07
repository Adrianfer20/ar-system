// hooks/useProfilesApi.ts
import { apiRequest } from "@/lib/api.service";
import type { Timestamp } from "firebase/firestore";
import { useCallback, useState } from "react";

export interface Profile {
  name: string;
  uptime: string;
  server: string;
  createdAt?: Timestamp;
}

export function useProfilesApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfiles = useCallback(async (userName: string): Promise<Profile[]> => {
    setLoading(true);
    setError(null);
    try {
      return await apiRequest<Profile[]>(`/users/${userName}/profiles`);
    } catch (err: any) {
      setError(err.message || "Error al obtener perfiles");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getProfile = useCallback(async (userName: string, profileName: string): Promise<Profile | null> => {
    setError(null);
    try {
      return await apiRequest<Profile>(`/users/${userName}/profiles/${profileName}`);
    } catch (err: any) {
      setError(err.message || "Error al obtener perfil");
      return null;
    }
  }, []);

  const createProfile = async (userName: string, data: Profile) => {
    return apiRequest<Profile>(`/users/${userName}/profiles`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  const updateProfile = async (userName: string, profileName: string, data: Partial<Profile>) => {
    return apiRequest<Profile>(`/users/${userName}/profiles/${profileName}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };

  const deleteProfile = async (userName: string, profileName: string) => {
    return apiRequest<{ message: string }>(`/users/${userName}/profiles/${profileName}`, {
      method: "DELETE",
    });
  };

  return { getProfiles, getProfile, createProfile, updateProfile, deleteProfile, loading, error };
}
