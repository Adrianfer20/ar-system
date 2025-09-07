// src/features/tickets/context/TicketsContext.tsx
import { useTicketsApi } from "@/hooks/useTicketsApi";
import React, { createContext, useContext, useEffect } from "react";

type TicketsContextType = ReturnType<typeof useTicketsApi>;

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);


export const TicketsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ticketsApi = useTicketsApi();

  useEffect(() => {
    // Aquí puedes realizar acciones adicionales con ticketsApi si es necesario
    ticketsApi.getAllTickets();
  }, []);

  return (
    <TicketsContext.Provider value={ticketsApi}>
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = (): TicketsContextType => {
  const context = useContext(TicketsContext);
  if (!context) {
    throw new Error("useTickets debe usarse dentro de un TicketsProvider");
  }
  return context;
};
