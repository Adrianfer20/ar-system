// src/features/tickets/components/TicketFilters.tsx
import React from "react";
import { FiUser, FiFileText, FiSearch } from "react-icons/fi";
import Select from "@/components/ui/Select";
import { PageSection } from "@/components/ui/Section";

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
    <PageSection hover bodyClassName="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-b from-white to-slate-50">
      <div className="grid grid-cols-2 gap-4 md:col-span-2">
        {/* Usuario */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
        <div className="relative rounded pr-1 border border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-50 pb-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiUser className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <Select
            aria-label="Filtro de usuario"
            value={selectedUser}
            onChangeValue={onUserChange}
            options={[{ label: "Todos los usuarios", value: "all" }, ...users.map(u => ({ label: u, value: u }))]}
            withLeftIcon
          />
        </div>
      </div>

      {/* Perfil */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
        <div className="relative rounded pr-1 border border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-50 pb-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiFileText className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <Select
            aria-label="Filtro de perfil"
            value={selectedProfile}
            onChangeValue={onProfileChange}
            options={[{ label: "Todos los perfiles", value: "all" }, ...profiles.map(p => ({ label: p, value: p }))]}
            withLeftIcon
          />
        </div>
      </div>
  
      </div>

      {/* Código */}
      <div>
        <label htmlFor="code-filter" className="block text-sm font-medium text-gray-700 mb-1">Código</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              id="code-filter"
              name="code-filter"
              placeholder="Ej: A1B2-C3D4..."
              value={codeFilter}
              onChange={(e) => onCodeChange(e.target.value)}
              className="block w-full rounded-md border border-slate-300 py-2 pl-10 pr-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <button
            type="button"
            onClick={reset}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
          >
            Limpiar
          </button>
        </div>
      </div>
    </PageSection>
  );
};

export default TicketFilters;
