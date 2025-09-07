// hooks/useTicketsApi.ts
import { apiRequest } from "@/lib/api.service";
import { useState } from "react";
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
    try {
      const users: User[] = await getUsers();
      const allTickets: FullTicket[] = [];

      for (const user of users) {
        const profilesResponse = await apiRequest<Profile[]>(
          `/users/${user.userName}/profiles`
        );
        const profiles = profilesResponse;
        for (const profile of profiles) {
          const ticketsResponse = await apiRequest<{ success: boolean; data: any[] }>(
            `/users/${user.userName}/profiles/${profile.name}/tickets`
          );
          const ticketsData = ticketsResponse.data;
          ticketsData.forEach((t) => {
            allTickets.push({
              user: user.userName,
              profile: profile.name,
              server: profile.server,
              uptime: profile.uptime,
              ticket: {
                ticketId: t.id,
                codes: t.codes.map((c: any) => ({
                  value: c.code,
                  used: c.status,
                  usedAt: c.usedAt
                })),
              },
            });
          });
        }
      }
      setTickets(allTickets);
      return allTickets;
    } catch (err: any) {
      setError(err.message);
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
    try {
      return await apiRequest<Ticket[]>(`/users/${userName}/profiles/${profileName}/tickets`);
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getTicket = async (userName: string, profileName: string, ticketId: string): Promise<Ticket | null> => {
    if (!userName || !profileName || !ticketId) throw new Error("getTicket requiere todos los parámetros");
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
    return apiRequest<Ticket>(`/users/${userName}/profiles/${profileName}/tickets`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  const updateCode = async (userName: string, profileName: string, ticketId: string, codeValue: string) => {
    if (!userName || !profileName || !ticketId || !codeValue) throw new Error("updateCode requiere todos los parámetros");
    return apiRequest<Ticket>(
      `/users/${userName}/profiles/${profileName}/tickets/${ticketId}/codes/${codeValue}`,
      { method: "PATCH" }
    );
  };

  const updateCodeByValue = async (userName: string, profileName: string, codeValue: string) => {
    if (!userName || !profileName || !codeValue) throw new Error("updateCodeByValue requiere todos los parámetros");
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
  };
}
