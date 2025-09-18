import React, { useMemo, useState } from "react";
import type { FullTicket } from "@/hooks/useTicketsApi";
import { useTickets } from "@/context/TicketsContext";
import { usePdf } from "../hooks/usePdf";
import useCMD from "../hooks/useCMD";
import Button, { IconButton } from "@/components/ui/Button";
import { FaPrint, FaTrashAlt, FaEllipsisV, FaRegCopy, FaCode, FaRegCalendarAlt, FaFileCode, FaUser } from "react-icons/fa";

interface Props {
  item: FullTicket;
}

function truncateMiddle(str: string, front = 5, back = 5) {
  if (str.length <= front + back) return str;
  return `${str.slice(0, front)}...${str.slice(-back)}`;
}

const TicketRow: React.FC<Props> = ({ item }) => {
  const { deleteTicket } = useTickets();
  const { printPDF } = usePdf();
  const { cmdAddUser } = useCMD();

  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalCodes = item.ticket.codes.length;
  const createdDate = useMemo(() => {
    const d = new Date(item.ticket.createdAt._seconds * 1000);
    return d.toLocaleDateString();
  }, [item.ticket.createdAt._seconds]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.ticket.ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // fallback
      alert("No se pudo copiar el ID");
    }
  };

  const handlerDelete = async () => {
    try {
      await deleteTicket(item.user, item.profile, item.ticket.ticketId);
    } catch (error) {
      alert("Error al eliminar el ticket: " + error);
    }
  };

  return (
    <li className="bg-white border border-slate-200 rounded-md shadow-sm px-4 py-4 sm:px-6 transition-all hover:shadow-md hover:border-slate-300">
      <div className="grid grid-cols-12 items-center gap-3">
        {/* Zona Izquierda: Identificación */}
  <div className="col-span-12 sm:col-span-5 flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-slate-900 truncate max-w-[200px]" title={item.ticket.ticketId}>
              {truncateMiddle(item.ticket.ticketId)}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-slate-500 hover:text-slate-700"
              aria-label="Copiar ID"
              title="Copiar ID"
            >
              <FaRegCopy />
            </button>
            {copied && <span className="text-xs text-green-600">¡Copiado!</span>}
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold uppercase bg-blue-50 text-blue-700 border border-blue-200">
            <FaUser className="text-slate-500" /> {item.user}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            Perfil: {item.profile}
          </span>
        </div>

        {/* Zona Central: Metadatos */}
        <div className="col-span-12 sm:col-span-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1" title="Fecha de creación">
            <FaRegCalendarAlt />
            Creado: {createdDate}
          </span>
          <span className="inline-flex items-center gap-1" title="Total de códigos">
            <FaCode />
            {totalCodes} Códigos
          </span>
        </div>

        {/* Zona Derecha: Acciones */}
        <div className="col-span-12 sm:col-span-3 flex items-center justify-start sm:justify-end gap-2 relative">
          <Button variant="outline" onClick={() => printPDF(item)}>
            <FaPrint />
            <span>Imprimir</span>
          </Button>

          <IconButton ariaLabel="Más opciones" onClick={() => setMenuOpen(v => !v)}>
            <FaEllipsisV />
          </IconButton>

          {menuOpen && (
            <div className="absolute right-0 top-10 z-10 w-48 rounded-md border border-slate-200 bg-white shadow-lg py-1">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => { setMenuOpen(false); /* renombrado de CMD */ cmdAddUser(item); }}
              >
                <FaFileCode className="text-slate-500" />
                <span>Copiar CMD</span>
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => { setMenuOpen(false); handlerDelete(); }}
              >
                <FaTrashAlt />
                <span>Eliminar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default TicketRow;
