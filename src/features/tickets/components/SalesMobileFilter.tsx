import React from "react";
import { FiCalendar, FiX, FiChevronDown } from "react-icons/fi";

export type SalesMobileFilterProps = {
  users: string[];
  selectedUser: string;
  onChangeUser: (u: string) => void;
  mode: "day" | "week";
  onChangeMode: (m: "day" | "week") => void;
  selectedDate: string; // YYYY-MM-DD
  onChangeDate: (d: string) => void;
  onClear: () => void;
};

const SalesMobileFilter: React.FC<SalesMobileFilterProps> = ({
  users,
  selectedUser,
  onChangeUser,
  mode,
  onChangeMode,
  selectedDate,
  onChangeDate,
  onClear,
}) => {
  const setToday = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    onChangeDate(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 space-y-3">
      {/* Fila 1: Usuario y Vista */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Selector de Usuario */}
        <div className="relative flex-1">
          <label htmlFor="user-select-mobile" className="sr-only">Usuario</label>
          <select
            id="user-select-mobile"
            className="w-full appearance-none bg-slate-100 border-slate-200 text-slate-700 py-2 pl-3 pr-8 rounded-md text-sm font-medium capitalize focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
            value={selectedUser}
            onChange={(e) => onChangeUser(e.target.value)}
          >
            <option value="all">Todos los usuarios</option>
            {users.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <FiChevronDown size={16} />
          </div>
        </div>

        {/* Selector de Modo (Día/Semana) */}
        <div className="w-full flex-shrink-0 inline-flex self-center rounded-md border border-slate-200">
          <button
            type="button"
            onClick={() => onChangeMode("day")}
            className={`w-full px-4 py-2 text-sm font-semibold rounded-l-md ${mode === "day" ? "bg-primary-600 text-white" : "bg-white text-slate-700 hover:bg-primary-600 cursor-pointer"}`}
            aria-pressed={mode === "day"}
          >
            Día
          </button>
          <button
            type="button"
            onClick={() => onChangeMode("week")}
            className={`w-full px-4 py-2 text-sm font-semibold rounded-r-md border-l border-slate-200 ${mode === "week" ? "bg-primary-600 text-white" : "bg-white text-slate-700 hover:bg-primary-600 hover:text-white cursor-pointer"}`}
            aria-pressed={mode === "week"}
          >
            Semana
          </button>
        </div>
      </div>

      {/* Fila 2: Fecha y Acciones (solo en modo día) */}
      {mode === "day" && (
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onChangeDate(e.target.value)}
            className="w-full flex-1 bg-slate-100 border-slate-200 text-slate-700 rounded-md p-2 text-sm font-medium focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
          />
          <button
            type="button"
            onClick={setToday}
            className="flex-shrink-0 px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiCalendar size={16} />
            <span>Hoy</span>
          </button>
        </div>
      )}

      {/* Fila 3: Limpiar Filtros */}
      <div className="pt-2 border-t border-slate-200">
        <button
          type="button"
          className="text-slate-500 hover:text-primary-600 text-xs font-semibold flex items-center justify-center gap-1.5 w-full"
          onClick={onClear}
        >
          <FiX size={14} />
          Limpiar todos los filtros
        </button>
      </div>
    </div>
  );
};

export default SalesMobileFilter;
