import React, { useMemo, useState } from "react";
import { useTickets } from "@/context/TicketsContext";
import TicketFilters from "../components/TicketFilters";
import TicketCard from "../components/TicketCard";
import { Page, PageHeader } from "@/components/ui/Page";
import { P } from "@/components/ui/Typography";
import { PageSectionHeader } from "@/components/ui/Section";

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
  if (loading) return <Page><P className="text-center" variant="muted">Cargando tickets...</P></Page>;
  if (error) return <Page><P variant="danger">{error}</P></Page>;
  if (!tickets) return <Page><P variant="muted">No hay tickets cargados aún...</P></Page>;

  return (
    <Page>
      <PageHeader
        title="Lista de Tickets"
        subtitle="Explora y filtra los tickets disponibles."
      />
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

  <PageSectionHeader title="🎟️ Resultados" />

      {/* Lista de tickets */}
      {filteredTickets.length === 0 ? (
  <P variant="muted">No hay tickets que coincidan con el filtro.</P>
      ) : (
        <ul className="space-y-5">
          {filteredTickets.map((item, i) => (
            <TicketCard key={i} item={item} />
          ))}
        </ul>
      )}
  </Page>
  );
};

export default ListTicketsPage;
