import { useTickets } from "@/context/TicketsContext";
import type { FullTicket } from "@/hooks/useTicketsApi";
import { FaTicketAlt, FaPrint, FaTrashAlt, FaTerminal } from "react-icons/fa";
import { usePdf } from "../hooks/usePdf";
import useCMD from "../hooks/useCMD";
import Button, { IconButton } from "@/components/ui/Button";
import Card, { CardBody, CardFooter } from "@/components/ui/Card";

interface TicketCardProps {
  item: FullTicket
}


export default function TicketCard({ item }: TicketCardProps) {
  // const [showModal, setShowModal] = useState<boolean>(false);
  const { deleteTicket } = useTickets();
  const { printPDF } = usePdf()
  const { cmdAddUser } = useCMD()

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
    <li>
      <Card hover>
      <CardBody>
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
      </CardBody>

      {/* Pie de la tarjeta */}
      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-slate-600">
          Creado:  {new Date(item.ticket.createdAt._seconds * 1000).toLocaleDateString()}
        </p>
        <div className="flex items-center gap-2">
          <Button onClick={() => handlerPrint(item)}>
            <FaPrint />
            <span>Imprimir</span>
          </Button>
          <Button onClick={() => handlerCMD(item)} variant="outline">
            <FaTerminal />
            <span>CMD</span>
          </Button>
          <IconButton ariaLabel="Eliminar Ticket" onClick={HandlerDelete} className="text-red-600 hover:text-red-700">
            <FaTrashAlt size={16} />
          </IconButton>
        </div>
      </CardFooter>
      </Card>
    </li>
  );
}

