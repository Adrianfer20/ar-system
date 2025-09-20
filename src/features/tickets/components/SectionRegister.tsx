// src/features/tickets/components/SectionRegister.tsx
import { useMemo, useState } from "react";
import { useTickets } from "@/context/TicketsContext";
import TicketFilters from "./TicketFilters";
import ClientList from "./ClientList";
import { H2, P } from "@/components/ui/Typography";
import { useAuth } from "@/features/auth/hooks/useAuth";

const SectionRegister = () => {
  const { tickets, loading, error } = useTickets();
  const { user } = useAuth();

  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState("all");
  const [codeFilter, setCodeFilter] = useState("");

  const users = useMemo(() => {
    const all = tickets ? Array.from(new Set(tickets.map((t) => t.user))) : [];
    if (user?.role === 'client') return all.filter(u => u.toLowerCase() === (user.displayName ?? '').toLowerCase());
    return all;
  }, [tickets, user]);
  const profiles = useMemo(
    () => (tickets ? Array.from(new Set(tickets.map((t) => t.profile))) : []),
    [tickets]
  );

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    return tickets.filter((t) => {
      const matchUser = selectedUser === "all" || t.user === selectedUser;
      const matchProfile = selectedProfile === "all" || t.profile === selectedProfile;
      const matchCode =
        !codeFilter ||
        t.ticket.codes.some((c) =>
          c.value.toLowerCase().includes(codeFilter.toLowerCase())
        );

      return matchUser && matchProfile && matchCode;
    });
  }, [tickets, selectedUser, selectedProfile, codeFilter]);

  return (
    <div>
      <TicketFilters
        users={users}
        profiles={profiles}
        selectedUser={selectedUser}
        selectedProfile={selectedProfile}
        codeFilter={codeFilter}
        onUserChange={(v) => {
          if (user?.role === 'client') return;
          setSelectedUser(v);
        }}
        onProfileChange={setSelectedProfile}
        onCodeChange={setCodeFilter}
      />

  <H2 className="mb-4">👤 Lista de Clientes</H2>

      {/* Mensajes de estado en lugar correcto */}
      {loading && <P className="text-center" variant="muted">Cargando Clientes...</P>}
      {error && <P className="text-center p-2 rounded-md bg-red-100" variant="danger">{error}</P>}
      {!loading && !error && (!tickets || tickets.length === 0) && (
        <P className="text-center" variant="muted">No hay clientes cargados aún...</P>
      )}

      {!loading && !error && tickets && (
        <ClientList tickets={filteredTickets} />
      )}
    </div>
  );
};

export default SectionRegister;
