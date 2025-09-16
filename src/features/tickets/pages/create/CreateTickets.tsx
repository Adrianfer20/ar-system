// src/features/tickets/pages/CreateTickets.tsx
import React, { useState } from "react";
import { useTicketsApi } from "@/hooks/useTicketsApi";
import { useUsersData } from "../../hooks/useUsersData";
import { useProfilesData } from "../../hooks/useProfilesData";
import { useFormHandler } from "@/hooks/useFormHandler";
import SelectInput from "../../components/SelectInput";

interface TicketPayload {
  quantity: number;
}

interface ChildProps {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const CreateTickets: React.FC<ChildProps> = ({ setActiveTab }) => {
  const { createTicket, getAllTickets } = useTicketsApi();

  const { users, loading: loadingUsers } = useUsersData();
  const [selectedUser, setSelectedUser] = useState("");

  const { profiles, loading: loadingProfiles } = useProfilesData(selectedUser);
  const [selectedProfile, setSelectedProfile] = useState("");

  const [quantity, setQuantity] = useState<number>(1);

  const { handleSubmit: submitForm, loading: creating, error } = useFormHandler({
    onSubmit: async (data: TicketPayload) => {
      if (!selectedUser || !selectedProfile) throw new Error("Selecciona usuario y perfil.");
      await createTicket(selectedUser, selectedProfile, data);
      setSelectedUser("");
      setSelectedProfile("");
      setQuantity(1);
      await getAllTickets();
    },
    onSuccess: () => setActiveTab("info"),
    successMessage: "✅ Tickets creados correctamente",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm({ quantity });
  };

  return (
    <div className="max-w-lg mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg overflow-hidden"
      >
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎟️ Crear Nuevos Tickets
          </h2>

          {/* Usuario */}
          <SelectInput
            label="Usuario"
            value={selectedUser}
            onChange={(val) => {
              setSelectedUser(val);
              setSelectedProfile("");
            }}
            options={users.map((u) => ({ label: u.userName, value: u.userName }))}
          />

          {/* Perfil */}
          {selectedUser && (
            <SelectInput
              label="Perfil"
              value={selectedProfile}
              onChange={setSelectedProfile}
              options={profiles.map((p) => ({ label: p.name, value: p.name }))}
            />
          )}

          {/* Cantidad */}
          <SelectInput
            label="Cantidad"
            value={quantity.toString()}
            onChange={(val) => setQuantity(Number(val))}
            options={[84, 246, 472, 948].map((q) => ({
              label: q.toString(),
              value: q.toString(),
            }))}
          />

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md font-semibold shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={
              !selectedUser ||
              !selectedProfile ||
              quantity < 1 ||
              creating ||
              loadingUsers ||
              loadingProfiles
            }
          >
            {creating ? "Creando..." : "Crear Tickets"}
          </button>

          {error && (
            <p className="mt-3 text-center text-sm font-medium p-2 rounded-md bg-red-100 text-red-700">
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateTickets;
