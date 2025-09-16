// src/features/tickets/components/TicketFilters.tsx
import React from "react";
import { BsFolder2Open, BsPerson, BsSearch } from "react-icons/bs";
import Select from "@/components/ui/Select";
import Card, { CardBody } from "@/components/ui/Card";

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
  <Card className="mb-6">
      <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        <div className="flex justify-between md:justify-center items-center gap-4">
          {/* --- Filtro de Usuario --- */}
        <div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <BsPerson className="h-5 w-5 text-slate-400" aria-hidden="true" />
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

        {/* --- Filtro de Perfil --- */}
        <div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <BsFolder2Open className="h-5 w-5 text-slate-400" aria-hidden="true" />
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
              className="block w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

      </CardBody>
    </Card>
  );
};

export default TicketFilters;
