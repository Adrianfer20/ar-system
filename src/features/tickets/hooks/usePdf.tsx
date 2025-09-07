import { useEffect, useState, useCallback } from "react";
import type { FullTicket } from "@/hooks/useTicketsApi";

export function usePdf() {
  const [ticket, setTicket] = useState<FullTicket | null>(null);

  const beforePrint = useCallback(() => {
    if (!ticket) return;

    const $root = document.getElementById("root");
    if (!$root) return;

    // Eliminar div previo si existe
    const oldDiv = document.getElementById("print-ticket");
    if (oldDiv) oldDiv.remove();

    // Crear contenedor para impresión
    const div = document.createElement("div");
    div.id = "print-ticket";
    div.className = "min-h-screen bg-slate-100 text-slate-900 p-6";

    // Título
    const h2 = document.createElement("h2");
    h2.className = "text-2xl font-bold text-center mb-4";
    h2.textContent = "Configuración Registrada";

    // Detalles del ticket
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "flex justify-between items-center gap-2 text-center px-2";

    const makeDetail = (label: string, value: string | number) => {
      const h4 = document.createElement("h4");
      h4.textContent = `${label}: `;
      const val = document.createElement("i");
      val.className = "font-semibold capitalize";
      val.textContent = String(value);
      h4.appendChild(val);
      return h4;
    };

    detailsDiv.appendChild(makeDetail("Usuario", ticket.user));
    detailsDiv.appendChild(makeDetail("Perfil", ticket.profile));
    // detailsDiv.appendChild(makeDetail("Ticket ID", ticket.ticket.ticketId));
    detailsDiv.appendChild(makeDetail("Cantidad", ticket.ticket.codes.length));

    // Lista de códigos
    const codesDiv = document.createElement("div");
    codesDiv.className = "mt-6";

    const codesH4 = document.createElement("h4");
    codesH4.className = "font-semibold uppercase indent-2 mb-2";
    codesH4.textContent = "Códigos:";

    const ul = document.createElement("ul");
    ul.className = "grid gap-2 grid-cols-6";

    ticket.ticket.codes.forEach(({ value }) => {
      const li = document.createElement("li");
      li.className =
        "text-black text-2xl font-semibold list-none text-center p-2";
      li.textContent = value;
      ul.appendChild(li);
    });

    codesDiv.appendChild(codesH4);
    codesDiv.appendChild(ul);

    // Montar todo en el div principal
    div.appendChild(h2);
    div.appendChild(detailsDiv);
    div.appendChild(codesDiv);

    $root.appendChild(div);
  }, [ticket]);

  const afterPrint = useCallback(() => {
    const $pdf = document.getElementById("print-ticket");
    if ($pdf) $pdf.remove();
  }, []);

  useEffect(() => {
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
    };
  }, [beforePrint, afterPrint]);

  const printPDF = (t: FullTicket) => {
    setTicket(t);
    // Forzar actualización antes de print
    setTimeout(() => {
      document.title = `Perfil ${t.profile} - Tickets ${t.ticket.codes.length} - ${t.ticket.ticketId} - ${new Date().toLocaleDateString()}`;
      window.print();
    }, 100);
  };

  return { printPDF };
}
