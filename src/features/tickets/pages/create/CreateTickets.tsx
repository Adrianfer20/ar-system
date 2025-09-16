// src/features/tickets/pages/create/CreateTickets.tsx
import React, { useState } from "react";
import { useTickets } from "@/context/TicketsContext";
import { useUsersData } from "../../hooks/useUsersData";
import { useProfilesData } from "../../hooks/useProfilesData";
import { useFormHandler } from "@/hooks/useFormHandler";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";
import { H2, P } from "@/components/ui/Typography";

interface TicketPayload {
  quantity: number;
}

interface ChildProps {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const CreateTickets: React.FC<ChildProps> = ({ setActiveTab }) => {
  const { createTicket, getAllTickets } = useTickets();

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
      <Card>
  <form onSubmit={handleSubmit} noValidate aria-busy={loadingUsers || loadingProfiles || creating}>
          <CardBody className="min-w-0 space-y-4">
          <H2 className="mb-4">Crear nuevos tickets</H2>

          {/* Usuario o skeleton */}
          {loadingUsers ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-10 w-full bg-slate-200 rounded" />
            </div>
          ) : (
            <Select
              label="Usuario"
              value={selectedUser}
              onChangeValue={(val) => {
                setSelectedUser(val);
                setSelectedProfile("");
              }}
              options={users.map((u) => ({ label: u.userName, value: u.userName }))}
              placeholder="Selecciona un usuario"
              disabled={loadingUsers}
              required
            />
          )}

          {/* Perfil */}
          {selectedUser && (
            loadingProfiles ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 w-28 bg-slate-200 rounded" />
                <div className="h-10 w-full bg-slate-200 rounded" />
              </div>
            ) : (
              <Select
                label="Perfil"
                value={selectedProfile}
                onChangeValue={setSelectedProfile}
                options={profiles.map((p) => ({ label: p.name, value: p.name }))}
                placeholder="Selecciona un perfil"
                disabled={loadingProfiles}
                required
              />
            )
          )}

          {/* Cantidad */}
          <Select
            label="Cantidad"
            value={quantity.toString()}
            onChangeValue={(val) => setQuantity(Number(val))}
            options={[84, 246, 472, 948].map((q) => ({
              label: q.toString(),
              value: q.toString(),
            }))}
            required
          />
          </CardBody>

          <div className="bg-slate-50 px-6 py-4" aria-live="polite">
            <Button
              type="submit"
              fullWidth
              disabled={
                !selectedUser ||
                !selectedProfile ||
                quantity < 1 ||
                creating ||
                loadingUsers ||
                loadingProfiles
              }
              isLoading={creating}
            >
              Crear tickets
            </Button>

            {error && (
              <P className="mt-3 text-center text-sm font-medium p-2 rounded-md bg-red-100" variant="danger">
                {error}
              </P>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateTickets;
