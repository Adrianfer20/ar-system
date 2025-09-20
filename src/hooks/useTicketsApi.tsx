// hooks/useTicketsApi.ts
import { apiRequest } from "@/lib/api.service";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
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
  const { user: authUser } = useAuth();

  const { getUsers } = useUsersApi();
  // Derivar nombres propios aceptables (displayName, parte local de email, y userName mapeado por email desde backend)
  const getSelfUserNames = (usersList?: User[]): string[] => {
    const names = new Set<string>();
    const dn = authUser?.displayName?.trim();
    if (dn) names.add(dn.toLowerCase());
    const email = authUser?.email?.toLowerCase();
    if (email) {
      const local = email.split("@")[0];
      if (local) names.add(local);
      const match = usersList?.find(u => (u.email || "").toLowerCase() === email);
      if (match?.userName) names.add(match.userName.toLowerCase());
    }
    return Array.from(names);
  };

  // -----------------------------
  // Obtener todos los tickets de todos los users/profiles
  // -----------------------------
  const getAllTickets = async (): Promise<FullTicket[]> => {
    setLoading(true);
    setError(null);
    try {
      const users: User[] = await getUsers();

      // Si es cliente, limitar a sus propios usuarios (por nombres derivados y/o email)
      let targetUsers = users;
      if (authUser?.role === "client") {
        const selfNames = new Set(getSelfUserNames(users));
        const email = authUser.email?.toLowerCase();
        targetUsers = users.filter(u =>
          selfNames.has(u.userName.toLowerCase()) || (!!email && (u.email || "").toLowerCase() === email)
        );
      }

      const perUserTickets = await Promise.all(
        targetUsers.map(async (user) => {
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
      // Filtro final por seguridad: si es client, asegurar solo sus tickets
      let scoped = all;
      if (authUser?.role === "client") {
        const selfNames = new Set(getSelfUserNames(users));
        scoped = all.filter(t => selfNames.has(t.user.toLowerCase()));
      }
      setTickets(scoped);
      return scoped;
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
    if (authUser?.role === "client") {
      const allowed = new Set(getSelfUserNames());
      if (!allowed.has(userName.toLowerCase())) throw new Error("No autorizado para consultar tickets de otros usuarios");
    }
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
  if (authUser?.role !== "admin") throw new Error("No autorizado: requiere rol admin");
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
    if (authUser?.role === "client") {
      const allowed = new Set(getSelfUserNames());
      if (!allowed.has(userName.toLowerCase())) throw new Error("No autorizado para consultar tickets de otros usuarios");
    }
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
  if (authUser?.role !== "admin") throw new Error("No autorizado: requiere rol admin");
    if (!userName || !profileName) throw new Error("createTicket requiere userName y profileName");
    setError(null);
    return apiRequest<Ticket>(`/users/${userName}/profiles/${profileName}/tickets`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  const updateCode = async (userName: string, profileName: string, ticketId: string, codeValue: string) => {
  if (authUser?.role !== "admin") throw new Error("No autorizado: requiere rol admin");
    if (!userName || !profileName || !ticketId || !codeValue) throw new Error("updateCode requiere todos los parámetros");
    setError(null);
    return apiRequest<Ticket>(
      `/users/${userName}/profiles/${profileName}/tickets/${ticketId}/codes/${codeValue}`,
      { method: "PATCH" }
    );
  };

  const updateCodeByValue = async (userName: string, profileName: string, codeValue: string) => {
  if (authUser?.role !== "admin") throw new Error("No autorizado: requiere rol admin");
    if (!userName || !profileName || !codeValue) throw new Error("updateCodeByValue requiere todos los parámetros");
    setError(null);
    return apiRequest<Ticket>(
      `/users/${userName}/profiles/${profileName}/tickets/codes/${codeValue}`,
      { method: "PATCH" }
    );
  };

  const deleteTicket = async (userName: string, profileName: string, ticketId: string) => {
  if (authUser?.role !== "admin") throw new Error("No autorizado: requiere rol admin");
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
    if (authUser?.role !== "admin") throw new Error("No autorizado: requiere rol admin");
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
    if (authUser?.role !== "admin") throw new Error("No autorizado: requiere rol admin");
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
