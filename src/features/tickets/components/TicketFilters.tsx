// src/features/tickets/components/TicketFilters.tsx
import React from "react";
import { BsFolder2Open, BsPerson, BsSearch } from "react-icons/bs";

interface Props {
  users: string[];
  profiles: string[];
  selectedUser: string;
  selectedProfile: string;
  codeFilter: string;
  onUserChange: (v: string) => void;
  onProfileChange: (v: string) => void;
  onCodeChange: (v: string) => void;
}

const TicketFilters: React.FC<Props> = ({
  users,
  profiles,
  selectedUser,
  selectedProfile,
  codeFilter,
  onUserChange,
  onProfileChange,
  onCodeChange,
}) => {
  return (
    // --- Contenedor Principal ---
    // Un solo "card" que agrupa todos los filtros, con buen padding y estilos consistentes.
    <div className="mb-6 p-5 bg-white border border-slate-200 rounded shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        <div className="flex justify-between md:justify-center items-center gap-4">
          {/* --- Filtro de Usuario --- */}
        <div>
          <label
            htmlFor="user-filter"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Usuario
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <BsPerson className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <select
              id="user-filter"
              name="user-filter"
              value={selectedUser}
              onChange={(e) => onUserChange(e.target.value)}
              // El plugin @tailwindcss/forms permite que estas clases funcionen a la perfección
              className="block w-full rounded-lg border-slate-300 py-2 pl-10 pr-4 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="all">Todos los usuarios</option>
              {users.map((u) => (
                <option key={u} value={u} className="capitalize">
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* --- Filtro de Perfil --- */}
        <div>
          <label
            htmlFor="profile-filter"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Perfil
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <BsFolder2Open className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <select
              id="profile-filter"
              name="profile-filter"
              value={selectedProfile}
              onChange={(e) => onProfileChange(e.target.value)}
              className="block w-full rounded-lg border-slate-300 py-2 pl-10 pr-4 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="all">Todos los perfiles</option>
              {profiles.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
        </div>
        
        {/* --- Filtro de Código --- */}
        <div className="w-full max-w-md">
          <label
            htmlFor="code-filter"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Buscar por Código
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <BsSearch className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              id="code-filter"
              name="code-filter"
              placeholder="Ej: A1B2-C3D4..."
              value={codeFilter}
              onChange={(e) => onCodeChange(e.target.value)}
              className="block w-full rounded-xl border border-primary-600 py-2 pl-10 pr-4 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default TicketFilters;
