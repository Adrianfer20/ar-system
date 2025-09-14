import { useTickets } from "@/context/TicketsContext";
import type { FullTicket } from "@/hooks/useTicketsApi";
import { FaTicketAlt, FaPrint, FaTrashAlt, FaTerminal } from "react-icons/fa";
import { usePdf } from "../hooks/usePdf";
import  useCDM  from "../hooks/useCMD";

interface TicketCardProps {
  item: FullTicket
}


export default function TicketCard({ item }: TicketCardProps) {
  // const [showModal, setShowModal] = useState<boolean>(false);
  const { deleteTicket } = useTickets();
  const { printPDF } = usePdf()
  const { cmdAddUser } = useCDM()

  const HandlerDelete = async () => {
    try {
      await deleteTicket(item.user, item.profile, item.ticket.ticketId);
    } catch (error) {
      alert("Error al eliminar el ticket: " + error);
    }
  }

  const handlerPrint = (item: FullTicket) => {
    printPDF(item);
  };

  const handlerCMD = (item: FullTicket) => {
    cmdAddUser(item);
  };

  return (
    <li className="bg-gray-300 rounded shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-xl hover:border-slate-300">
      <div className="p-5">
        {/* Cabecera de la tarjeta */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-slate-800 capitalize">
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

      {/* Pie de la tarjeta */}
      <div className="bg-slate-50 px-5 py-3 flex justify-between items-center border-t border-slate-200">
        <p className="text-xs text-primary-500 font-bold">
          Creado:  {new Date(item.ticket.createdAt._seconds * 1000).toLocaleDateString()}
        </p>
        <div className="flex items-center gap-3">
          <button onClick={() => handlerPrint(item)} className="bg-primary-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer">
            <FaPrint />
            <span>Imprimir</span>
          </button>
          <button onClick={() => handlerCMD(item)} className="bg-primary-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer">
            <FaTerminal />
            <span>CMD</span>
          </button>
          <button
            title="Eliminar Ticket"
            onClick={HandlerDelete}
            className="text-slate-500 p-2 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
          >
            <FaTrashAlt size={16} />
          </button>
        </div>
      </div>
    </li>
  );
}

