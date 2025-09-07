import React, { useState, useMemo } from "react";
import { useTickets } from "@/context/TicketsContext";

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
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>{children}</div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-4 border-b border-gray-200">{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-800">{children}</h2>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

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

  // 4. Agrupar por día o semana
  const groupedSales = useMemo(() => {
    if (mode === "day") {
      const grouped: Record<string, Sale[]> = {};
      filteredSales.forEach(s => {
        const day = s.usedAt.toISOString().slice(0, 10);
        if (!grouped[day]) grouped[day] = [];
        grouped[day].push(s);
      });
      return grouped;
    } else {
      const grouped: Record<string, Sale[]> = {};
      filteredSales.forEach(s => {
        const week = `${s.usedAt.getFullYear()}-W${getWeekNumber(s.usedAt)}`;
        if (!grouped[week]) grouped[week] = [];
        grouped[week].push(s);
      });
      return grouped;
    }
  }, [filteredSales, mode]);

  // 5. Función para alternar "ver más"
  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reporte de Ventas</h1>
        <p className="text-gray-600 mt-1">Análisis de tickets utilizados por el personal.</p>
      </header>

      {/* Filtros */}
      <div className="bg-white rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
      </div>

      {/* Ventas */}
      {Object.entries(groupedSales).length === 0 ? (
        <p className="text-gray-500">No hay ventas para los filtros seleccionados.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groupedSales).map(([period, sales]) => (
            <Card key={period}>
              <CardHeader>
                <CardTitle>
                  {mode === "day" ? `Día: ${period}` : `Semana: ${period}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {users
                  .filter(u => selectedUser === "all" || u === selectedUser)
                  .map(u => {
                    const userSales = sales.filter(s => s.user === u);
                    if (userSales.length === 0) return null;

                    const key = `${period}-${u}`;
                    const isExpanded = expanded[key] || false;

                    return (
                      <div key={u} className="mb-4">
                        <h3 className="font-medium text-gray-800 capitalize">{u}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-gray-500">{userSales.length} tickets vendidos</p>
                          <button
                            onClick={() => toggleExpand(key)}
                            className="text-primary-500 hover:underline cursor-pointer"
                          >
                            {isExpanded ? "ver menos" : "ver más"}
                          </button>
                        </div>
                        {isExpanded && (
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            {userSales.map((s, idx) => (
                              <li key={idx} className="text-gray-600">
                                {s.code}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesPage;


