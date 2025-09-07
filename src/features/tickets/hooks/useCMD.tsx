import type { FullTicket } from "@/hooks/useTicketsApi";

function useCMD() {
  // Función para copiar comandos de agregar usuarios
  const cmdAddUser = (params: FullTicket) => {
    const { server, profile, ticket, uptime  } = params;

    const $textarea = document.createElement("textarea");
    $textarea.textContent = "/ip hotspot user\n";

    ticket.codes.forEach(({ value }) => {
      $textarea.textContent += `add name="${value}" server="${server}" profile="${profile}" limit-uptime="${uptime}"\n`;
    });

    const content = $textarea.textContent;

    navigator.clipboard
      .writeText(content)
      .then(() => {
        console.log(
          "Se ha copiado el código de la terminal MikroTik al portapapeles satisfactoriamente."
        );
        alert("Se ha copiado el código de la terminal MikroTik al portapapeles.");
      })
      .catch((err) => {
        console.error("Algo salió mal al copiar al portapapeles", err);
        alert("Error al copiar el código al portapapeles.");
      });
  };

  // Función para copiar comandos de eliminar usuarios
  const cmdDeleteUsers = (ticket: FullTicket) => {
    const { ticket: t } = ticket;

    const $textarea = document.createElement("textarea");
    $textarea.textContent = "/ip hotspot user\n";

    t.codes.forEach(({ value }) => {
      $textarea.textContent += `remove [find where name="${value}"]\n`;
    });

    const content = $textarea.textContent;

    navigator.clipboard
      .writeText(content)
      .then(() => {
        console.log(
          "Se ha copiado el código para eliminar usuarios al portapapeles."
        );
        alert("Código para eliminar usuarios copiado al portapapeles.");
      })
      .catch((err) => {
        console.error("Error al copiar al portapapeles", err);
        alert("Error al copiar el código para eliminar usuarios.");
      });
  };

  return {cmdAddUser, cmdDeleteUsers};
}

export default useCMD;
