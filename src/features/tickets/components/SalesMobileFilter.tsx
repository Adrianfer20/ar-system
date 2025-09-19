import React from "react";
import Card, { CardBody } from "@/components/ui/Card";
import { FiCalendar, FiX, FiUsers } from "react-icons/fi";

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
    <Card className="max-w-sm mx-auto">
      <CardBody className="p-4">
        {/* Usuario */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user-select">
            Usuario
          </label>
          <div className="relative">
            <select
              id="user-select"
              className="select-input block w-full bg-gray-100 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500 capitalize"
              value={selectedUser}
              onChange={(e) => onChangeUser(e.target.value)}
            >
              <option value="all">Todos los usuarios</option>
              {users.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-700">
              <FiUsers />
            </div>
          </div>
        </div>

        {/* Vista */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Vista</label>
          <div className="flex rounded-lg overflow-hidden border border-amber-500">
            <button
              type="button"
              className={`flex-1 py-2 text-center text-sm font-medium ${
                mode === "day" ? "bg-amber-500 text-white" : "bg-white text-amber-700"
              }`}
              onClick={() => onChangeMode("day")}
              aria-pressed={mode === "day"}
            >
              Día
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-center text-sm font-medium ${
                mode === "week" ? "bg-amber-500 text-white" : "bg-white text-amber-700"
              }`}
              onClick={() => onChangeMode("week")}
              aria-pressed={mode === "week"}
            >
              Semana
            </button>
          </div>
        </div>

        {/* Fecha (opcional) */}
        {mode === "day" && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date-input">
              Fecha (opcional)
            </label>
            <div className="relative">
              <input
                id="date-input"
                type="date"
                className="date-input block w-full bg-gray-100 border border-gray-200 text-gray-700 py-2 pl-2 pr-10 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                value={selectedDate}
                onChange={(e) => onChangeDate(e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 ml-20">
                <FiCalendar />
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex justify-between space-x-2">
          <button
            type="button"
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center text-sm"
            onClick={setToday}
          >
            <FiCalendar className="mr-2" /> Hoy
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg flex items-center justify-center text-sm"
            onClick={onClear}
          >
            <FiX className="mr-2" /> Limpiar
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default SalesMobileFilter;
