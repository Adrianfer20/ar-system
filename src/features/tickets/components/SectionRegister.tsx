// src/features/tickets/components/SectionRegister.tsx
import { useMemo, useState } from "react";
import { useTickets } from "@/context/TicketsContext";
import TicketFilters from "./TicketFilters";
import ClientList from "./ClientList";

const SectionRegister = () => {
  const { tickets, loading, error } = useTickets();

  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState("all");
  const [codeFilter, setCodeFilter] = useState("");

  const users = useMemo(
    () => (tickets ? Array.from(new Set(tickets.map((t) => t.user))) : []),
    [tickets]
  );
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
        onUserChange={setSelectedUser}
        onProfileChange={setSelectedProfile}
        onCodeChange={setCodeFilter}
      />

      <h1 className="text-2xl font-bold mb-4">👤 Lista de Clientes</h1>

      {/* Mensajes de estado en lugar correcto */}
      {loading && (
        <p className="text-center text-gray-500">Cargando Clientes...</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (!tickets || tickets.length === 0) && (
        <p className="text-gray-600">No hay clientes cargados aún...</p>
      )}

      {!loading && !error && tickets && (
        <ClientList tickets={filteredTickets} />
      )}
    </div>
  );
};

export default SectionRegister;
