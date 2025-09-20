import React, { useMemo, useState } from "react";
import type { FullTicket } from "@/hooks/useTicketsApi";
import { useTickets } from "@/context/TicketsContext";
import { usePdf } from "../hooks/usePdf";
import useCMD from "../hooks/useCMD";
import Card from "@/components/ui/Card";
import { FaPrint, FaTrashAlt, FaEllipsisV, FaRegCopy, FaCode, FaRegCalendarAlt, FaFileCode } from "react-icons/fa";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface Props {
  item: FullTicket;
}

const TicketRow: React.FC<Props> = ({ item }) => {
  const { deleteTicket } = useTickets();
  const { user } = useAuth();
  const { printPDF } = usePdf();
  const { cmdAddUser } = useCMD();

  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalCodes = item.ticket.codes.length;
  const createdDate = useMemo(() => {
    const d = new Date(item.ticket.createdAt._seconds * 1000);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }, [item.ticket.createdAt._seconds]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.ticket.ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      alert("No se pudo copiar el ID");
    }
  };

  const handlerDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este ticket?")) {
      try {
        await deleteTicket(item.user, item.profile, item.ticket.ticketId);
      } catch (error) {
        alert("Error al eliminar el ticket: " + error);
      }
    }
  };

  return (
    <Card className="flex flex-col">
      {/* Encabezado */}
      <div className="flex justify-between items-start p-3 bg-slate-50 border-b border-slate-200 rounded-t-lg">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-bold text-slate-800 capitalize">{item.user}</h3>
            <span className="text-sm font-medium text-slate-600 capitalize">({item.profile})</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-md">
              ID: {item.ticket.ticketId.substring(0, 8)}...
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-slate-400 hover:text-primary-600 transition-colors"
              aria-label="Copiar ID completo"
              title="Copiar ID completo"
            >
              <FaRegCopy />
            </button>
            {copied && <span className="text-xs text-green-600 font-semibold">¡Copiado!</span>}
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(v => !v)} className="p-2 text-slate-500 hover:bg-slate-200 rounded-md">
            <FaEllipsisV />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 z-10 w-48 rounded-md border border-slate-200 bg-white shadow-lg py-1">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => { setMenuOpen(false); cmdAddUser(item); }}
              >
                <FaFileCode className="text-slate-500" />
                <span>Copiar CMD</span>
              </button>
              {user?.role === "admin" && (
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={() => { setMenuOpen(false); handlerDelete(); }}
                >
                  <FaTrashAlt />
                  <span>Eliminar</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cuerpo */}
      <div className="flex-grow p-3 grid grid-cols-2 gap-3 items-center">
        <div className="flex flex-col text-sm">
          <span className="text-slate-500 inline-flex items-center gap-1.5"><FaRegCalendarAlt /> Creado</span>
          <span className="font-semibold text-slate-700">{createdDate}</span>
        </div>
        <div className="flex flex-col text-sm">
          <span className="text-slate-500 inline-flex items-center gap-1.5"><FaCode /> Códigos</span>
          <span className="font-semibold text-slate-700">{totalCodes}</span>
        </div>
      </div>

      {/* Pie de página */}
      <div className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-center rounded-b-lg">
        <button
          onClick={() => printPDF(item)}
          className="w-full text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center justify-center gap-2 cursor-pointer mb-2"
        >
          <FaPrint />
          Imprimir Tickets
        </button>
      </div>
    </Card>
  );
};

export default TicketRow;
