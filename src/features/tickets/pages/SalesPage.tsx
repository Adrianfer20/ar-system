import React, { useState, useMemo } from "react";
import { useTickets } from "@/context/TicketsContext";
import { Page, PageHeader } from "@/components/ui/Page";
import Card from "@/components/ui/Card";
import { P } from "@/components/ui/Typography";
import { PageSection } from "@/components/ui/Section";
import SalesMobileFilter from "@/features/tickets/components/SalesMobileFilter";

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

// Formatea YYYY-MM-DD en hora local (evita UTC / toISOString)
function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Obtiene el número de semana ISO-8601 usando hora local (lunes como primer día)
function getWeekNumber(date: Date) {
  const tmpDate = new Date(date);
  // normalizar a medianoche local
  tmpDate.setHours(0, 0, 0, 0);
  // día de la semana (1=lunes, 7=domingo)
  const day = (tmpDate.getDay() || 7);
  // mover al jueves de la semana actual
  tmpDate.setDate(tmpDate.getDate() + 4 - day);
  // inicio de año ISO (1 de enero local)
  const yearStart = new Date(tmpDate.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((+tmpDate - +yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

// Año ISO para semanas (puede diferir del getFullYear en bordes de año)
function getISOWeekYear(date: Date) {
  const tmpDate = new Date(date);
  tmpDate.setHours(0, 0, 0, 0);
  const day = (tmpDate.getDay() || 7);
  tmpDate.setDate(tmpDate.getDate() + 4 - day);
  return tmpDate.getFullYear();
}

// Fecha legible en español (por ejemplo: "Martes, 16 de septiembre de 2025" o compacto "16 SEP, Mar")
function formatPrettyDateEs(date: Date, options?: { compact?: boolean }) {
  const { compact } = options || {};
  if (compact) {
    const day = new Intl.DateTimeFormat("es-ES", { day: "2-digit" }).format(date);
    const mon = new Intl.DateTimeFormat("es-ES", { month: "short" }).format(date).toUpperCase();
    const wk = new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(date);
    return `${day} ${mon}, ${wk}`;
  }
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
}

// Convierte "YYYY-MM-DD" a Date local (evitando parse UTC de Date(string))
function dateFromKeyLocal(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function prevDateKey(key: string) {
  const dt = dateFromKeyLocal(key);
  dt.setDate(dt.getDate() - 1);
  return formatLocalDate(dt);
}

// --- COMPONENTES VISUALES ---
// Usar Card UI compartido para consistencia

// --- COMPONENTE PRINCIPAL ---
const SalesPage: React.FC = () => {
  const { tickets } = useTickets();
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date())); // YYYY-MM-DD
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
        const dateKey = formatLocalDate(s.usedAt);
        const dateMatch = !selectedDate || dateKey === selectedDate;
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
      const period = mode === "day"
        ? formatLocalDate(s.usedAt)
        : `${getISOWeekYear(s.usedAt)}-W${getWeekNumber(s.usedAt)}`;
      if (!grouped[period]) grouped[period] = {};
      if (!grouped[period][s.user]) grouped[period][s.user] = {};
      if (!grouped[period][s.user][s.profile]) grouped[period][s.user][s.profile] = [];
      grouped[period][s.user][s.profile].push(s);
    });
    return grouped;
  }, [filteredSales, mode]);

  // 4.1. Mapa de conteos por usuario y día para tendencia
  const countsByUserDay = useMemo(() => {
    // Construir mapa usando TODAS las ventas (no filtradas) para poder comparar vs ayer
    const m = new Map<string, Map<string, number>>(); // user -> (dayKey -> count)
    allSales.forEach(s => {
      const dayKey = formatLocalDate(s.usedAt);
      if (!m.has(s.user)) m.set(s.user, new Map());
      const userMap = m.get(s.user)!;
      userMap.set(dayKey, (userMap.get(dayKey) ?? 0) + 1);
    });
    return m;
  }, [allSales]);

  // 5. Función para alternar "ver más"
  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Page>
      <PageHeader title="Resumen Diario" subtitle="Análisis de tickets utilizados por el personal." />

      {/* Filtros - Mobile */}
      <div className="sm:hidden mb-4">
        <SalesMobileFilter
          users={users}
          selectedUser={selectedUser}
          onChangeUser={setSelectedUser}
          mode={mode}
          onChangeMode={setMode}
          selectedDate={selectedDate}
          onChangeDate={setSelectedDate}
          onClear={() => { setSelectedUser("all"); setMode("day"); setSelectedDate(""); }}
        />
      </div>

      {/* Filtros - Desktop */}
      <PageSection className="hidden sm:block" bodyClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
          <div className="relative">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="select-input w-full border-gray-300 rounded-md p-2 pr-9 shadow-sm capitalize"
            >
              <option value="all">Todos los usuarios</option>
              {users.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-gray-600">�</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vista</label>
          <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
            <button
              type="button"
              onClick={() => setMode("day")}
              className={`px-3 py-2 text-sm font-medium ${mode === "day" ? "bg-yellow-500 text-primary" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              aria-pressed={mode === "day"}
            >
              Día
            </button>
            <button
              type="button"
              onClick={() => setMode("week")}
              className={`px-3 py-2 text-sm font-medium border-l border-gray-300 ${mode === "week" ? "bg-yellow-500 text-primary" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              aria-pressed={mode === "week"}
            >
              Semana
            </button>
          </div>
        </div>
        {mode === "day" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha (opcional)</label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input w-full sm:flex-1 border-gray-300 rounded-md p-2 shadow-sm min-w-0"
              />
              <button
                type="button"
                onClick={() => setSelectedDate(formatLocalDate(new Date()))}
                className="p-2 text-sm bg-yellow-500 border border-gray-300 rounded hover:bg-yellow-600 hover:text-white flex-shrink-0 cursor-pointer"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={() => setSelectedDate("")}
                className="px-2 py-2 text-sm text-gray-600 hover:text-gray-800 flex-shrink-0"
              >
                Limpiar
              </button>
            </div>
          </div>
        )}
      </PageSection>

      {/* Ventas */}
      <div className="">
        {Object.entries(groupedSales).length === 0 ? (
          <P variant="muted">No hay ventas para los filtros seleccionados.</P>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-start">
            {Object.entries(groupedSales)
              .sort(([a], [b]) => {
                if (mode === "day") {
                  // Ordenar por fecha descendente (más reciente primero)
                  return b.localeCompare(a);
                } else {
                  const [yearA, weekA] = a.split('-W').map(Number);
                  const [yearB, weekB] = b.split('-W').map(Number);
                  // Ordenar por semana ISO descendente (año y semana más recientes primero)
                  return yearA !== yearB ? yearB - yearA : weekB - weekA;
                }
              })
              .map(([period, userGroups]) => (
                Object.entries(userGroups)
                  .filter(([user]) => selectedUser === "all" || user === selectedUser)
                  .map(([user, salesByProfile]) => {
                    const total = Object.values(salesByProfile).reduce((acc, arr) => acc + arr.length, 0);
                    const entries = Object.entries(salesByProfile).map(([profile, arr]) => ({ profile, count: arr.length }));
                    entries.sort((a, b) => b.count - a.count);

                    // Indicador de tendencia (modo día)
                    let trendColor = "border-gray-200";
                    let trendBadgeBg = "bg-gray-100";
                    let trendText = "";
                    let trendArrow = "";
                    if (mode === "day") {
                      const userMap = countsByUserDay.get(user);
                      const yesterdayKey = prevDateKey(period);
                      const yesterday = userMap?.get(yesterdayKey) ?? 0;
                      const today = total;
                      if (yesterday === 0 && today > 0) {
                        trendColor = "border-green-400";
                        trendBadgeBg = "bg-green-50";
                        trendArrow = "▲";
                        trendText = "nuevo";
                      } else if (yesterday > 0) {
                        const diff = today - yesterday;
                        const pct = Math.round((diff / yesterday) * 100);
                        if (pct > 0) {
                          trendColor = "border-green-400";
                          trendBadgeBg = "bg-green-50";
                          trendArrow = "▲";
                          trendText = `+${pct}% vs ayer`;
                        } else if (pct < 0) {
                          trendColor = "border-red-400";
                          trendBadgeBg = "bg-red-50";
                          trendArrow = "▼";
                          trendText = `${pct}% vs ayer`;
                        } else {
                          trendColor = "border-gray-300";
                          trendBadgeBg = "bg-gray-50";
                          trendArrow = "•";
                          trendText = "sin cambio";
                        }
                      } else {
                        trendColor = "border-gray-200";
                        trendBadgeBg = "bg-gray-50";
                        trendArrow = "•";
                        trendText = "–";
                      }
                    }

                    const cardKey = `${period}-${user}`;
                    const isExpanded = expanded[cardKey] || false;
                    const prettyDate = mode === "day"
                      ? formatPrettyDateEs(dateFromKeyLocal(period), { compact: true })
                      : `Semana ${period.replace('-W', ' ')}`;

                    return (
                      <Card key={cardKey} className={`flex flex-col min-w-0 border-l-4 ${trendColor}`} hover>
                        {/* Encabezado con Vendedor y Fecha */}
                        <div className="flex justify-between items-center p-3 bg-slate-50 border-b border-slate-200">
                          <p className="font-bold text-slate-800 capitalize">{user}</p>
                          <p className="text-xs text-slate-500">{prettyDate}</p>
                        </div>

                        {/* Cuerpo principal */}
                        <div className="flex flex-grow p-3">
                          {/* Total de Ventas */}
                          <div className="flex flex-col items-center justify-center pr-3 border-r border-slate-200">
                            <span className="text-4xl font-black text-slate-800 tracking-tighter">{total}</span>
                            <span className="text-xs text-slate-500 -mt-1">ventas</span>
                          </div>

                          {/* Desglose y Tendencia */}
                          <div className="pl-3 flex-grow flex flex-col justify-center">
                            {entries.map(({ profile, count }) => (
                              <div key={profile} className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 capitalize truncate">{profile}</span>
                                <span className="font-semibold text-slate-800">{count}</span>
                              </div>
                            ))}
                            {mode === "day" && trendText !== "–" && (
                              <div className={`inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full text-xs self-start ${trendBadgeBg}`}>
                                <span className={trendColor.includes("red") ? "text-red-600" : trendColor.includes("green") ? "text-green-600" : "text-gray-500"} aria-hidden>
                                  {trendArrow}
                                </span>
                                <span className="text-gray-700 font-medium">{trendText}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Footer con botón para expandir */}
                        <div className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-center">
                          <button
                            onClick={() => toggleExpand(cardKey)}
                            className="text-xs font-semibold text-primary-600 hover:text-primary-800"
                          >
                            {isExpanded ? 'Ocultar Códigos' : 'Ver Códigos'}
                          </button>
                        </div>

                        {/* Contenido expandido con los códigos */}
                        {isExpanded && (
                          <div className="p-3 border-t border-slate-200 bg-white space-y-3">
                            {Object.entries(salesByProfile).map(([profile, sales]) => (
                              <div key={profile}>
                                <p className="text-sm text-gray-700 font-medium capitalize">{profile} <span className="text-gray-500 font-normal">({sales.length})</span></p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {sales.map((s, idx) => (
                                    <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-gray-600 text-xs font-mono break-all">
                                      {s.code}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    );
                  })
              ))}
          </div>
        )}
      </div>
    </Page>
  );
};

export default SalesPage;


