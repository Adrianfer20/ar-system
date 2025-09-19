import React from "react";
import { FiSearch, FiX, FiChevronDown, FiUser, FiFileText } from "react-icons/fi";

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
  const reset = () => {
    onUserChange("all");
    onProfileChange("all");
    onCodeChange("");
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Selector de Usuario */}
        <div className="relative">
          <label htmlFor="user-filter" className="sr-only">Usuario</label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <FiUser size={16} />
          </div>
          <select
            id="user-filter"
            value={selectedUser}
            onChange={(e) => onUserChange(e.target.value)}
            className="w-full appearance-none bg-slate-100 border-slate-200 text-slate-700 py-2 pl-9 pr-8 rounded-md text-sm font-medium capitalize focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Todos los usuarios</option>
            {users.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <FiChevronDown size={16} />
          </div>
        </div>

        {/* Selector de Perfil */}
        <div className="relative">
          <label htmlFor="profile-filter" className="sr-only">Perfil</label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <FiFileText size={16} />
          </div>
          <select
            id="profile-filter"
            value={selectedProfile}
            onChange={(e) => onProfileChange(e.target.value)}
            className="w-full appearance-none bg-slate-100 border-slate-200 text-slate-700 py-2 pl-9 pr-8 rounded-md text-sm font-medium capitalize focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">Todos los perfiles</option>
            {profiles.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <FiChevronDown size={16} />
          </div>
        </div>

        {/* Filtro de Código */}
        <div className="relative">
          <label htmlFor="code-filter" className="sr-only">Código</label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <FiSearch size={16} />
          </div>
          <input
            type="text"
            id="code-filter"
            placeholder="Buscar por código..."
            value={codeFilter}
            onChange={(e) => onCodeChange(e.target.value)}
            className="w-full bg-slate-100 border-slate-200 text-slate-700 py-2 pl-9 pr-8 rounded-md text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {codeFilter && (
            <button
              type="button"
              onClick={() => onCodeChange("")}
              className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-500 hover:text-slate-700"
              aria-label="Limpiar búsqueda"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Botón de Limpiar */}
      {(selectedUser !== 'all' || selectedProfile !== 'all' || codeFilter !== '') && (
        <div className="pt-3 mt-3 border-t border-slate-200 text-center">
          <button
            type="button"
            onClick={reset}
            className="text-slate-500 hover:text-primary-600 text-xs font-semibold flex items-center justify-center gap-1.5 w-full"
          >
            <FiX size={14} />
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketFilters;
