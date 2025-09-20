// src/features/tickets/context/TicketsContext.tsx
import { useTicketsApi } from "@/hooks/useTicketsApi";
import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

type TicketsContextType = ReturnType<typeof useTicketsApi>;

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);


export const TicketsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ticketsApi = useTicketsApi();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Esperar a que Auth termine; luego cargar según rol/usuario actual
    if (isLoading) return;
    ticketsApi.getAllTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user?.uid, user?.role, user?.email, user?.displayName]);

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
