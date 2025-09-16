import React, { useMemo, useState } from "react";
import { useTickets } from "@/context/TicketsContext";
import TicketFilters from "../components/TicketFilters";
import TicketCard from "../components/TicketCard";

const ListTicketsPage: React.FC = () => {
  const { tickets, loading, error } = useTickets();

  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedProfile, setSelectedProfile] = useState("all");
  const [codeFilter, setCodeFilter] = useState("");

  // Opciones únicas de usuarios y perfiles
  const users = useMemo(
    () => (tickets ? Array.from(new Set(tickets.map((t) => t.user))) : []),
    [tickets]
  );
  const profiles = useMemo(
    () => (tickets ? Array.from(new Set(tickets.map((t) => t.profile))) : []),
    [tickets]
  );

  // Aplicar filtros
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

  // 🔽 Los returns condicionales van después de hooks
  if (loading) return <p className="text-center text-slate-500">Cargando tickets...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!tickets) return <p>No hay tickets cargados aún...</p>;

  return (
    <div className="p-6">
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

      <h1 className="text-2xl font-bold mb-4">🎟️ Lista de Tickets</h1>

      {/* Lista de tickets */}
      {filteredTickets.length === 0 ? (
  <p className="text-slate-600">No hay tickets que coincidan con el filtro.</p>
      ) : (
        <ul className="space-y-5">
          {filteredTickets.map((item, i) => (
            <TicketCard key={i} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListTicketsPage;
