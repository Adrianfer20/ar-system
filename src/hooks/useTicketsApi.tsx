// hooks/useTicketsApi.ts
import { apiRequest } from "@/lib/api.service";
import { useState } from "react";
import { db, USERS_COLLECTION } from "@/lib/firebase.config";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { useUsersApi } from "./useUserApi";
import type { Profile } from "./useProfilesApi";
import type { User } from "@/types/User.type";

export interface TicketCode {
  value: string;
  used: boolean;
  usedAt?: { _seconds: number; _nanoseconds: number } | null;
}

export interface Ticket {
  ticketId: string;
  createdAt: { _seconds: number; _nanoseconds: number };
  codes: TicketCode[];
}

export interface FullTicket {
  user: string;
  profile: string;
  ticket: Ticket;
  server: string;
  uptime: string;
}

export function useTicketsApi() {
  const [tickets, setTickets] = useState<FullTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getUsers } = useUsersApi();

  // -----------------------------
  // Obtener todos los tickets de todos los users/profiles
  // -----------------------------
  const getAllTickets = async (): Promise<FullTicket[]> => {
    setLoading(true);
    setError(null);
    try {
      const users: User[] = await getUsers();

      const perUserTickets = await Promise.all(
        users.map(async (user) => {
          const profiles = await apiRequest<Profile[]>(
            `/users/${user.userName}/profiles`
          );

          const perProfileTickets = await Promise.all(
            profiles.map(async (profile) => {
              const { data: ticketsData } = await apiRequest<{
                success: boolean;
                data: any[];
              }>(`/users/${user.userName}/profiles/${profile.name}/tickets`);

              return ticketsData.map((t) => ({
                user: user.userName,
                profile: profile.name,
                server: profile.server,
                uptime: profile.uptime,
                ticket: {
                  ticketId: t.id,
                  createdAt: t.createdAt,
                  codes: t.codes.map((c: any) => ({
                    value: c.code,
                    used: c.status,
                    usedAt: c.usedAt,
                  })),
                },
              })) as FullTicket[];
            })
          );

          return perProfileTickets.flat();
        })
      );

      const all = perUserTickets.flat();
      setTickets(all);
      return all;
    } catch (err: any) {
      setError(err.message ?? 'Error obteniendo tickets');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Obtener tickets de un usuario + perfil específico
  // -----------------------------
  const getTickets = async (userName: string, profileName: string): Promise<Ticket[]> => {
    if (!userName || !profileName) throw new Error("getTickets requiere userName y profileName");
    setLoading(true);
    setError(null);
    try {
      return await apiRequest<Ticket[]>(`/users/${userName}/profiles/${profileName}/tickets`);
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Importar códigos a un perfil existente (Firestore directo)
  // -----------------------------
  const importCodes = async (
    userName: string,
    profileName: string,
    codes: { code: string; status: boolean; usedAt: { _seconds: number; _nanoseconds: number } }[]
  ) => {
    if (!userName || !profileName) throw new Error("importCodes requiere userName y profileName");
    if (!codes?.length) throw new Error("No hay códigos para importar");
    setError(null);

    // Construir referencePath directo y escribir en subcolección 'tickets'
    const profileRef = doc(db, `${USERS_COLLECTION}/${userName}/Profile-Tickets/${profileName}`);

    // Normalizar códigos para Firestore (guardar como no usados)
    const codesPayload = codes.map((c) => ({
      code: c.code,
      status: false,
      usedAt: null,
    }));

    const ticketsCol = collection(profileRef, "Tickets");
    await addDoc(ticketsCol, {
      createdAt: serverTimestamp(),
      codes: codesPayload,
    });

    // refrescar listado local (si la API no refleja aún, esto puede no mostrarlo)
    await getAllTickets();
  };

  const getTicket = async (userName: string, profileName: string, ticketId: string): Promise<Ticket | null> => {
    if (!userName || !profileName || !ticketId) throw new Error("getTicket requiere todos los parámetros");
    setError(null);
    try {
      return await apiRequest<Ticket>(
        `/users/${userName}/profiles/${profileName}/tickets/${ticketId}`
      );
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const createTicket = async (userName: string, profileName: string, data: { quantity: number }) => {
    if (!userName || !profileName) throw new Error("createTicket requiere userName y profileName");
    setError(null);
    return apiRequest<Ticket>(`/users/${userName}/profiles/${profileName}/tickets`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  const updateCode = async (userName: string, profileName: string, ticketId: string, codeValue: string) => {
    if (!userName || !profileName || !ticketId || !codeValue) throw new Error("updateCode requiere todos los parámetros");
    setError(null);
    return apiRequest<Ticket>(
      `/users/${userName}/profiles/${profileName}/tickets/${ticketId}/codes/${codeValue}`,
      { method: "PATCH" }
    );
  };

  const updateCodeByValue = async (userName: string, profileName: string, codeValue: string) => {
    if (!userName || !profileName || !codeValue) throw new Error("updateCodeByValue requiere todos los parámetros");
    setError(null);
    return apiRequest<Ticket>(
      `/users/${userName}/profiles/${profileName}/tickets/codes/${codeValue}`,
      { method: "PATCH" }
    );
  };

  const deleteTicket = async (userName: string, profileName: string, ticketId: string) => {
    if (!userName || !profileName || !ticketId) {
      throw new Error("deleteTicket requiere todos los parámetros");
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{ message: string }>(
        `/users/${userName}/profiles/${profileName}/tickets/${ticketId}`,
        { method: "DELETE" }
      );

      // ✅ Actualizar estado local (remover el ticket eliminado)
      setTickets((prev) =>
        prev.filter(
          (t) =>
            !(
              t.user === userName &&
              t.profile === profileName &&
              t.ticket.ticketId === ticketId
            )
        )
      );

      return res;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (user: string, profile: string, ticketIds: string[]) => {
    setLoading(true);
    setError(null);
    try {
      // Eliminar cada ticket del perfil en paralelo
      await Promise.all(
        ticketIds.map((ticketId) =>
          apiRequest(`/users/${user}/profiles/${profile}/tickets/${ticketId}`, { method: "DELETE" })
        )
      );
      // Luego eliminar el perfil en sí en el backend
      await apiRequest(`/users/${user}/profiles/${profile}`, { method: "DELETE" });
      // Actualizar estado local: remover los tickets eliminados
      setTickets((prev) =>
        prev.filter(
          (t) => !(t.user === user && t.profile === profile && ticketIds.includes(t.ticket.ticketId))
        )
      );
    } catch (error: any) {
      console.error('Error deleting profile:', error);
      setError(error?.message ?? 'Error al eliminar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (user: string) => {
    setLoading(true);
    setError(null);
    try {
      // Eliminar el usuario/cliente en el backend
      await apiRequest(`/users/${user}`, { method: "DELETE" });
      // Actualizar estado local: remover todos los tickets del cliente
      setTickets((prev) => prev.filter((t) => t.user !== user));
    } catch (error: any) {
      console.error('Error deleting client:', error);
      setError(error?.message ?? 'Error al eliminar el cliente');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    tickets,
    loading,
    error,
    getAllTickets,
    getTickets,
    getTicket,
    createTicket,
    updateCode,
    updateCodeByValue,
    deleteTicket,
    deleteProfile,
    deleteClient,
    importCodes,
  };
}
