// src/features/tickets/components/ClientList.tsx
import type { FullTicket } from "@/hooks/useTicketsApi";
import React, { useMemo, useState } from "react";
import { BsFolder, BsInfoCircle, BsPersonCircle, BsTicketPerforated, BsThreeDotsVertical, BsChevronDown, BsChevronRight, BsPencil, BsTrash, BsEye, BsClockHistory } from "react-icons/bs";
import { useTickets } from '@/context/TicketsContext';
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";

interface Props {
  tickets: FullTicket[];
}

type GroupedTickets = {
  user: string;
  profiles: Record<string, FullTicket[]>;
};

// 👉 Función para agrupar por user > profile
function groupByUserAndProfile(tickets: FullTicket[]): GroupedTickets[] {
  const grouped: Record<string, GroupedTickets> = {};

  tickets.forEach((item) => {
    if (!grouped[item.user]) {
      grouped[item.user] = { user: item.user, profiles: {} };
    }

    if (!grouped[item.user].profiles[item.profile]) {
      grouped[item.user].profiles[item.profile] = [];
    }

    // 🔎 Aseguramos que siempre se agreguen todos los tickets,
    // incluso si son del mismo perfil
    grouped[item.user].profiles[item.profile].push(item);
  });

  // 🔎 Debug opcional
  // console.log("Grouped tickets:", grouped);

  return Object.values(grouped);
}


// const ClientList: React.FC<Props> = ({ tickets }) => {
//   if (tickets.length === 0)
//     return (
//       <p className="text-gray-600">
//         No hay tickets que coincidan con el filtro.
//       </p>
//     );

//   const grouped = groupByUserAndProfile(tickets);

//   return (
//     <div className="bg-green-600 space-y-6">
//       {grouped.map((group) => (
//         <div
//           key={group.user}
//           className="p-4 bg-blue-200 rounded shadow"
//         >
//           {/* Usuario */}
//           <h2 className="text-xl font-bold text-gray-800 mb-3">
//             👤 {group.user}
//           </h2>

//           {/* Perfiles dentro del usuario */}
//           {Object.entries(group.profiles).map(([profile, profileTickets]) => (
//             <div
//               key={profile}
//               className="ml-4 mb-4 p-3 rounded-lg bg-gray-50 border"
//             >
//               <h3 className="text-lg font-semibold text-green-700 mb-2">
//                 📂 Perfil: {profile}
//               </h3>

//               <ul className="space-y-2">
//                 {profileTickets.map((item, i) => (
//                   <li
//                     key={i}
//                     className="p-3 bg-white rounded shadow flex justify-between items-center"
//                   >
//                     <div>
//                       <p className="text-sm text-gray-500">
//                         Ticket ID:{" "}
//                         <span className="font-mono text-blue-600">
//                           {item.ticket.ticketId}
//                         </span>
//                       </p>
//                     </div>
//                     <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">
//                       {item.ticket.codes.length} códigos
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

const ClientList: React.FC<Props> = ({ tickets }) => {
  const { deleteTicket, deleteProfile, deleteClient } = useTickets();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  // Estados de expansión
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});
  const [expandedProfiles, setExpandedProfiles] = useState<Record<string, boolean>>({});
  // Estados de menús contextuales
  const [openMenu, setOpenMenu] = useState<{ type: 'user' | 'profile' | null; key?: string }>({ type: null });

  const grouped = useMemo(() => groupByUserAndProfile(tickets), [tickets]);

  const handleToggleUser = (user: string) => {
    setExpandedUsers(prev => ({ ...prev, [user]: !prev[user] }));
  };

  const handleToggleProfile = (user: string, profile: string) => {
    const key = `${user}::${profile}`;
    setExpandedProfiles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTickets(prev =>
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleDeleteSelected = async () => {
    if (confirm('¿Eliminar tickets seleccionados?')) {
      for (const ticketId of selectedTickets) {
        const ticket = tickets.find(t => t.ticket.ticketId === ticketId);
        if (ticket) {
          await deleteTicket(ticket.user, ticket.profile, ticketId);
        }
      }
      setSelectedTickets([]);
    }
  };

  const handleDeleteProfile = async (user: string, profile: string, profileTickets: FullTicket[]) => {
    if (confirm(`¿Eliminar todos los tickets del perfil ${profile} de ${user}?`)) {
      const ticketIds = profileTickets.map(t => t.ticket.ticketId);
      await deleteProfile(user, profile, ticketIds);
      setSelectedTickets(prev => prev.filter(id => !ticketIds.includes(id)));
    }
  };

  const handleDeleteClient = async (user: string) => {
    if (confirm(`¿Eliminar cliente ${user} y todos sus tickets?`)) {
      await deleteClient(user);
      setSelectedTickets([]);
    }
  };

  if (tickets.length === 0) {
    return (
  <div className="mt-10 flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded border border-slate-200">
        {/* 2. Reemplazamos el icono */}
        <BsInfoCircle className="h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700">
          No se encontraron tickets
        </h3>
        <p className="text-slate-500 max-w-xs mt-1">
          Prueba a ajustar los filtros o a verificar si existen tickets
          registrados.
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-4">
      {grouped.map((group) => {
        const isUserOpen = !!expandedUsers[group.user];
        const profilesCount = Object.keys(group.profiles).length;
        return (
          <Card key={group.user} className="shadow-md border-slate-300">
            <CardHeader className="p-4 sm:p-5 bg-white">
              <div
                className="flex items-center gap-4 cursor-pointer select-none"
                onClick={() => handleToggleUser(group.user)}
              >
                <button
                  aria-label={isUserOpen ? 'Colapsar cliente' : 'Expandir cliente'}
                  onClick={(e) => { e.stopPropagation(); handleToggleUser(group.user); }}
                  className="p-1 rounded hover:bg-slate-100 transition"
                >
                  {isUserOpen ? (
                    <BsChevronDown className="h-5 w-5 text-slate-600" />
                  ) : (
                    <BsChevronRight className="h-5 w-5 text-slate-600" />
                  )}
                </button>
                <span className="rounded-full bg-primary-100 p-2 ring-1 ring-primary-200 text-primary-700">
                  <BsPersonCircle className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-slate-950 capitalize truncate">
                    {group.user}
                  </h2>
                  <p className="text-xs font-semibold text-slate-700">
                    {profilesCount} {profilesCount === 1 ? 'Perfil' : 'Perfiles'}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    aria-label="Acciones del cliente"
                    className="p-2 rounded hover:bg-slate-100"
                    onClick={(e) => { e.stopPropagation(); setOpenMenu(prev => (prev.type === 'user' && prev.key === group.user ? { type: null } : { type: 'user', key: group.user })); }}
                  >
                    <BsThreeDotsVertical className="h-5 w-5 text-slate-600" />
                  </button>
                  {openMenu.type === 'user' && openMenu.key === group.user && (
                    <div className="relative">
                      <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                        <button className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2" onClick={() => setOpenMenu({ type: null })}>
                          <BsPencil className="h-4 w-4 text-slate-500" /> Editar Cliente
                        </button>
                        <button className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2" onClick={() => setOpenMenu({ type: null })}>
                          <BsEye className="h-4 w-4 text-slate-500" /> Ver Detalles
                        </button>
                        <button className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-red-600" onClick={() => { setOpenMenu({ type: null }); handleDeleteClient(group.user); }}>
                          <BsTrash className="h-4 w-4" /> Eliminar Cliente
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            {isUserOpen && (
              <div className="divide-y divide-slate-300">
                {Object.entries(group.profiles).map(([profile, profileTickets]) => {
                  const key = `${group.user}::${profile}`;
                  const isProfileOpen = !!expandedProfiles[key];
                  const ticketsCount = profileTickets.length;
                  return (
                    <CardBody key={profile} className="p-0">
                      <div className="m-4 rounded-md border border-slate-300 bg-white p-3 sm:p-4 hover:shadow border-l-4 border-l-primary-400">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => handleToggleProfile(group.user, profile)}
                        >
                          <button
                            aria-label={isProfileOpen ? 'Colapsar perfil' : 'Expandir perfil'}
                            onClick={(e) => { e.stopPropagation(); handleToggleProfile(group.user, profile); }}
                            className="p-1 rounded hover:bg-slate-100"
                          >
                            {isProfileOpen ? (
                              <BsChevronDown className="h-4 w-4 text-slate-600" />
                            ) : (
                              <BsChevronRight className="h-4 w-4 text-slate-600" />
                            )}
                          </button>
                          {/* Icono perfil: reloj para 1hr/2hr, si no, carpeta */}
                          {/(hr|hora|horas)/i.test(profile) ? (
                            <BsClockHistory className="h-5 w-5 text-primary-800" />
                          ) : (
                            <BsFolder className="h-5 w-5 text-primary-800" />
                          )}
                          <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                            Perfil: {profile}
                          </h3>
                          <span className="ml-2 inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-800 border border-primary-300">
                            {ticketsCount} {ticketsCount === 1 ? 'Ticket' : 'Tickets'}
                          </span>

                          <div className="ml-auto">
                            <button
                              aria-label="Acciones del perfil"
                              className="p-2 rounded hover:bg-slate-100"
                              onClick={(e) => { e.stopPropagation(); setOpenMenu(prev => (prev.type === 'profile' && prev.key === key ? { type: null } : { type: 'profile', key })); }}
                            >
                              <BsThreeDotsVertical className="h-5 w-5 text-slate-600" />
                            </button>
                            {openMenu.type === 'profile' && openMenu.key === key && (
                              <div className="relative">
                                <div className="absolute right-0 z-10 mt-2 w-52 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                                  <button className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2" onClick={() => setOpenMenu({ type: null })}>
                                    <BsPencil className="h-4 w-4 text-slate-500" /> Editar Perfil
                                  </button>
                                  <button className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2" onClick={() => setOpenMenu({ type: null })}>
                                    <BsEye className="h-4 w-4 text-slate-500" /> Duplicar Perfil
                                  </button>
                                  <button className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-red-600" onClick={() => { setOpenMenu({ type: null }); handleDeleteProfile(group.user, profile, profileTickets); }}>
                                    <BsTrash className="h-4 w-4" /> Eliminar Perfil
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {isProfileOpen && (
          <ul className="mt-3 space-y-2 pl-9">
                            {profileTickets.map((item) => (
                              <li
                                key={item.ticket.ticketId}
            className="flex justify-between items-center p-2 rounded-md bg-slate-50 border border-slate-300 hover:border-primary-400"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <input
                                    aria-label="Seleccionar ticket"
                                    type="checkbox"
                                    checked={selectedTickets.includes(item.ticket.ticketId)}
                                    onChange={() => handleSelectTicket(item.ticket.ticketId)}
                                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                  />
                                  <BsTicketPerforated className="h-4 w-4 text-slate-500 flex-shrink-0" />
                                  <p className="text-sm text-slate-800 truncate">
                                    Ticket ID: <span className="font-semibold font-mono text-slate-950">{item.ticket.ticketId}</span>
                                  </p>
                                </div>
                                <span className="text-xs font-semibold bg-primary-100 text-primary-800 px-2.5 py-1 rounded-full whitespace-nowrap border border-primary-300">
                                  Códigos: {item.ticket.codes.length}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </CardBody>
                  );
                })}
              </div>
            )}
          </Card>
        );
      })}

      {selectedTickets.length > 0 && (
    <div className="sticky bottom-2 z-10 ml-auto mr-0 flex w-full justify-end">
          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white/95 px-3 py-2 shadow-md">
            <span className="text-sm text-slate-600">{selectedTickets.length} seleccionados</span>
      <Button variant="outline" onClick={() => setSelectedTickets([])}>Limpiar</Button>
      <Button variant="outline" onClick={() => alert('Exportar próximamente')}>Exportar</Button>
            <Button variant="danger" onClick={handleDeleteSelected}>Eliminar</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;