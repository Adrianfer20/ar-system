import React, { useState, useMemo } from "react";
import { useTickets } from "@/context/TicketsContext";
import { Page, PageHeader } from "@/components/ui/Page";
import Card, { CardHeader as UICardHeader, CardBody as UICardBody } from "@/components/ui/Card";
import { H3, P } from "@/components/ui/Typography";
import { PageSection } from "@/components/ui/Section";

// --- TIPOS Y HELPERS ---
interface Sale {
  user: string;
  profile: string;
  usedAt: Date;
  code: string;
}

function toDate(timestamp?: { _seconds: number; _nanoseconds: number } | null): Date | null {
  if (!timestamp) return null;
  return new Date(timestamp._seconds * 1000 + Math.floor(timestamp._nanoseconds / 1e6));
}

function getWeekNumber(date: Date) {
  const tmpDate = new Date(date.getTime());
  tmpDate.setUTCDate(tmpDate.getUTCDate() + 4 - (tmpDate.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(tmpDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmpDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

// --- COMPONENTES VISUALES ---
// Usar Card UI compartido para consistencia

// --- COMPONENTE PRINCIPAL ---
const SalesPage: React.FC = () => {
  const { tickets } = useTickets();
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedDate, setSelectedDate] = useState(""); // YYYY-MM-DD
  const [mode, setMode] = useState<"day" | "week">("day");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({}); // control de "ver más"

  // 1. Extraer todas las ventas
  const allSales: Sale[] = useMemo(() => {
    if (!tickets) return [];
    return tickets.flatMap(ticket =>
      (ticket.ticket.codes ?? [])
        .filter(code => code.used && code.usedAt)
        .map(code => ({
          user: ticket.user,
          profile: ticket.profile,
          usedAt: toDate(code.usedAt)!,
          code: code.value
        }))
        .filter(sale => sale.usedAt)
    );
  }, [tickets]);

  // 2. Filtrar ventas según user y fecha si está en modo día
  const filteredSales = useMemo(() => {
    return allSales.filter(s => {
      const userMatch = selectedUser === "all" || s.user === selectedUser;
      if (mode === "day") {
        const dateMatch = !selectedDate || s.usedAt.toISOString().slice(0, 10) === selectedDate;
        return userMatch && dateMatch;
      }
      return userMatch;
    });
  }, [allSales, selectedUser, selectedDate, mode]);

  // 3. Usuarios únicos para filtros
  const users = useMemo(() => {
    if (!tickets) return [];
    return Array.from(new Set(tickets.map(t => t.user))).sort();
  }, [tickets]);

  // 4. Agrupar por día o semana, luego por usuario y perfil
  const groupedSales = useMemo(() => {
    const grouped: Record<string, Record<string, Record<string, Sale[]>>> = {};
    filteredSales.forEach(s => {
      const period = mode === "day" ? s.usedAt.toISOString().slice(0, 10) : `${s.usedAt.getFullYear()}-W${getWeekNumber(s.usedAt)}`;
      if (!grouped[period]) grouped[period] = {};
      if (!grouped[period][s.user]) grouped[period][s.user] = {};
      if (!grouped[period][s.user][s.profile]) grouped[period][s.user][s.profile] = [];
      grouped[period][s.user][s.profile].push(s);
    });
    return grouped;
  }, [filteredSales, mode]);

  // 5. Función para alternar "ver más"
  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Page>
      <PageHeader
        title="Reporte de Ventas"
        subtitle="Análisis de tickets utilizados por el personal."
      />

  {/* Filtros */}
  <PageSection bodyClassName="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full border-gray-300 rounded-md p-2 shadow-sm"
          >
            <option value="all">Todos los usuarios</option>
            {users.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modo</label>
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value as "day" | "week");
              setSelectedDate(""); // limpiar fecha si cambia a semanal
            }}
            className="w-full border-gray-300 rounded-md p-2 shadow-sm"
          >
            <option value="day">Por Día</option>
            <option value="week">Por Semana</option>
          </select>
        </div>

        {mode === "day" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha específica</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border-gray-300 rounded-md p-2 shadow-sm"
            />
          </div>
        )}
  </PageSection>

      {/* Ventas */}
      {Object.entries(groupedSales).length === 0 ? (
  <P variant="muted">No hay ventas para los filtros seleccionados.</P>
      ) : (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
          {Object.entries(groupedSales)
            .sort(([a], [b]) => {
              if (mode === "day") {
                return new Date(a).getTime() - new Date(b).getTime();
              } else {
                const [yearA, weekA] = a.split('-W').map(Number);
                const [yearB, weekB] = b.split('-W').map(Number);
                return yearA !== yearB ? yearA - yearB : weekA - weekB;
              }
            })
            .map(([period, userGroups]) => (
            <Card key={period}>
              <UICardHeader>
                <H3>{mode === "day" ? `Día: ${period}` : `Semana: ${period}`}</H3>
              </UICardHeader>
              <UICardBody>
                {Object.entries(userGroups)
                  .filter(([user]) => selectedUser === "all" || user === selectedUser)
                  .map(([user, salesByProfile]) => (
                    <div key={user} className="mb-4">
                      <H3 className="capitalize">{user}</H3>
                      {Object.entries(salesByProfile).map(([profile, sales]) => {
                        const key = `${period}-${user}-${profile}`;
                        const isExpanded = expanded[key] || false;

                        return (
                          <div key={profile} className="mt-2 bg-gray-50 p-3 rounded border border-gray-200">
                            <P size="sm" variant="muted">{sales.length} tickets vendidos ({profile})</P>
                            <div className="flex items-center justify-between mt-1">
                              <button
                                onClick={() => toggleExpand(key)}
                                className="text-primary-500 hover:underline cursor-pointer"
                              >
                                {isExpanded ? "ver menos" : "ver más"}
                              </button>
                            </div>
                            {isExpanded && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {sales.map((s, idx) => (
                                  <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-gray-600 text-sm">
                                    {s.code}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
              </UICardBody>
            </Card>
          ))}
        </div>
      )}
  </Page>
  );
};

export default SalesPage;


