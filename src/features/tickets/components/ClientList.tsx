// src/features/tickets/components/ClientList.tsx
import type { FullTicket } from "@/hooks/useTicketsApi";
import React, { useState } from "react";
import { BsFolder, BsInfoCircle, BsPersonCircle, BsTicketPerforated } from "react-icons/bs";
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
      // Limpiar selección de los tickets eliminados
      setSelectedTickets(prev => prev.filter(id => !ticketIds.includes(id)));
    }
  };

  const handleDeleteClient = async (user: string) => {
    if (confirm(`¿Eliminar cliente ${user} y todos sus tickets?`)) {
      await deleteClient(user);
      // Limpiar toda la selección (se removieron todos sus tickets)
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

  const grouped = groupByUserAndProfile(tickets);

  return (
    <div className="space-y-6">
      {grouped.map((group) => (
        <Card key={group.user}>
          <CardHeader>
            <div className="flex items-center gap-4">
              {/* 3. Reemplazamos el icono */}
              <BsPersonCircle className="h-10 w-10 text-slate-500" />
              <div>
                <h2 className="text-xl font-bold text-slate-800 capitalize">
                  {group.user}
                </h2>
                <p className="text-sm text-slate-500">
                  {Object.keys(group.profiles).length} perfil(es) encontrado(s)
                </p>
              </div>
        <div className="ml-auto">
                <Button variant="danger" onClick={() => handleDeleteClient(group.user)}>
                  Eliminar Cliente
                </Button>
              </div>
            </div>
      </CardHeader>

      <div className="divide-y divide-slate-200">
            {Object.entries(group.profiles).map(
              ([profile, profileTickets]) => (
        <CardBody key={profile}>
                  <div className="flex items-center gap-3 mb-4">
                    {/* 4. Reemplazamos el icono */}
                    <BsFolder className="h-6 w-6 text-primary-600" />
                    <h3 className="text-lg font-semibold text-slate-700">
                      Perfil: {profile}
                    </h3>
                    <div className="ml-auto">
                      <Button variant="danger" onClick={() => handleDeleteProfile(group.user, profile, profileTickets)}>
                        Eliminar Perfil
                      </Button>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {profileTickets.map((item) => (
                      <li
                        key={item.ticket.ticketId}
                        className="flex justify-between items-center p-3 rounded-lg transition-colors hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={selectedTickets.includes(item.ticket.ticketId)} 
                            onChange={() => handleSelectTicket(item.ticket.ticketId)} 
                          />
                          <BsTicketPerforated className="h-5 w-5 text-slate-400 flex-shrink-0" />
                          <p className="text-sm text-slate-600">
                            Ticket ID:{" "}
                            <span className="font-medium font-mono text-primary-700">
                              {item.ticket.ticketId}
                            </span>
                          </p>
                        </div>
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                          {item.ticket.codes.length} códigos
                        </span>
          </li>
                    ))}
                  </ul>
        </CardBody>
              )
            )}
          </div>
    </Card>
      ))}
      {selectedTickets.length > 0 && (
        <div>
          <Button variant="danger" onClick={handleDeleteSelected}>
            Eliminar Seleccionados ({selectedTickets.length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClientList;