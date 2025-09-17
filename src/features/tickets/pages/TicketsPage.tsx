import React, { useMemo, useState } from "react";
import { useTickets } from "@/context/TicketsContext";
import TicketFilters from "../components/TicketFilters";
import TicketRow from "../components/TicketRow";
import { Page, PageHeader } from "@/components/ui/Page";
import { H2, P } from "@/components/ui/Typography";

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


  // Título dinámico
  const pageTitle = useMemo(() => {
    if (selectedUser !== "all") return `Tickets de ${selectedUser}`;
    return "Lista de Tickets";
  }, [selectedUser]);

  return (
    <Page>
      <PageHeader
        title={pageTitle}
        subtitle="Bienvenido a la página de registro de tickets."
      />
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

  <H2 className="mb-4">🎟️ Lista de Tickets</H2>

      {/* Mensajes de estado en lugar correcto */}
      {loading && <P className="text-center" variant="muted">Cargando tickets...</P>}
      {error && <P variant="danger">{error}</P>}
      {!loading && !error && (!tickets || tickets.length === 0) && (
        <P variant="muted">No hay tickets cargados aún...</P>
      )}

      {/* Lista filtrada */}
      {!loading && !error && tickets && (
        <>
          {filteredTickets.length === 0 ? (
            <P>No hay tickets que coincidan con el filtro.</P>
          ) : (
            <ul className="space-y-3">
              {filteredTickets.map((item, i) => (
                <TicketRow key={i} item={item} />
              ))}
            </ul>
          )}
        </>
      )}
  </Page>
  );
};

export default TicketsPage;
