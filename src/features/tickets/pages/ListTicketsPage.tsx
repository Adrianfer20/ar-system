import React, { useMemo, useState } from "react";
import { useTickets } from "@/context/TicketsContext";
import TicketFilters from "../components/TicketFilters";
// Asegúrate de importar los iconos que vayas a usar
// Por ejemplo, de Font Awesome:
import { FaPrint, FaTrashAlt, FaTicketAlt } from 'react-icons/fa';

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
  if (loading) return <p className="text-center text-gray-500">Cargando tickets...</p>;
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
        <p className="text-gray-600">No hay tickets que coincidan con el filtro.</p>
      ) : (


        // ... tu componente
        <ul className="space-y-5">
          {filteredTickets.map((item, i) => (
            <li
              key={i}
              className="bg-gray-300 rounded shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-xl hover:border-slate-300"
            >
              <div className="p-5">
                {/* Cabecera de la tarjeta */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {item.user}
                    </h3>
                    <p className="text-sm text-slate-500">{item.profile}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 text-slate-600 text-xs font-mono px-2 py-1 rounded">
                    <FaTicketAlt />
                    <span>{item.ticket.ticketId}</span>
                  </div>
                </div>

                {/* Cuerpo de la tarjeta */}
                <div className="mt-4">
                  <p className="text-sm bg-primary-100 text-primary-700 font-semibold px-4 py-2 rounded-md inline-block">
                    Total de Códigos: {item.ticket.codes.length}
                  </p>
                </div>
              </div>

              {/* Pie de la tarjeta con acciones */}
              <div className="bg-slate-50 px-5 py-3 flex justify-between items-center border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  {/* Puedes poner aquí la fecha de creación o alguna otra info */}
                  Creado: {new Date().toLocaleDateString()}
                </p>
                <div className="flex items-center gap-3">
                  <button className="bg-primary-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer">
                    <FaPrint />
                    <span>Imprimir</span>
                  </button>
                  <button
                    title="Eliminar Ticket"
                    className="text-slate-500 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListTicketsPage;
