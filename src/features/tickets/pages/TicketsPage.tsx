import React, { useMemo, useState } from "react";
import { useTickets } from "@/context/TicketsContext";
import TicketFilters from "../components/TicketFilters";
import TicketCard from "../components/TicketCard";

const TicketsPage: React.FC = () => {
  const {  tickets, loading, error } = useTickets();

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
      const matchProfile =
        selectedProfile === "all" || t.profile === selectedProfile;
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
      <header className='mb-6'>
        <h1 className='text-2xl font-bold capitalize'>Informacion de los Tickets</h1>
        <p className='text-gray-600'>Bienvenido a la página de registro de tickets.</p>
      </header>
      {/* Filtros siempre visibles */}
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

      <h1 className="text-2xl font-bold mb-4 px-4">🎟️ Lista de Tickets</h1>

      {/* Mensajes de estado en lugar correcto */}
      {loading && (
        <p className="text-center text-gray-500">Cargando tickets...</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (!tickets || tickets.length === 0) && (
        <p className="text-gray-600">No hay tickets cargados aún...</p>
      )}

      {/* Lista filtrada */}
      {!loading && !error && tickets && (
        <>
          {filteredTickets.length === 0 ? (
            <p className="text-gray-600">
              No hay tickets que coincidan con el filtro.
            </p>
          ) : (
            <ul className="space-y-5">
              {filteredTickets.map((item, i) => (
                <TicketCard key={i} item={item} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default TicketsPage;
