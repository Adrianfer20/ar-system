// src/features/tickets/pages/create/CreateProfile.tsx
import React, { useEffect, useState } from "react";
import { useProfilesApi } from "@/hooks/useProfilesApi";
import { useUsersApi } from "@/hooks/useUserApi";
import type { User } from "@/types/User.type";
import { useTickets } from "@/context/TicketsContext";
import { useFormHandler } from '@/hooks/useFormHandler';
import Card, { CardBody } from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import FieldInput from "@/components/ui/FieldInput";
import Button from "@/components/ui/Button";

type ProfilePayload = {
  name: string;
  uptime: string;
  server: string;
};

interface ChildProps {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const formDataInitial: ProfilePayload = {
  name: "",
  uptime: "01:00:00",
  server: "Wifi Por Hora",
};

const CreateProfile: React.FC<ChildProps> = ({ setActiveTab }) => {
  // hook para usuarios
  const { getUsers } = useUsersApi();
  const { getAllTickets } = useTickets();


  // selected user (userName)
  const [selectedUser, setSelectedUser] = useState<string>("");

  // lista de usuarios local
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // form local
  const [form, setForm] = useState<ProfilePayload>(formDataInitial);

  const { handleSubmit: submitForm, loading: creating, error: submitError } = useFormHandler({
    onSubmit: async (data: ProfilePayload) => {
      if (!selectedUser) throw new Error("Debes seleccionar un usuario.");
      if (!data.name.trim() || !data.uptime.trim()) throw new Error("Nombre de perfil y uptime son obligatorios.");
      await createProfile(selectedUser, data);
      setForm(formDataInitial);
      getAllTickets();
    },
    onSuccess: () => setActiveTab("info"),
    successMessage: 'El perfil se ha creado correctamente',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(form);
  };

  // Hook de perfiles — lo inicializamos con selectedUser.
  // (Tu hook debería aceptar userName como parámetro y exponer createProfile)
  const profilesApi = useProfilesApi();
  const { createProfile } = profilesApi;

  // cargar usuarios al montar
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingUsers(true);
      setUsersError(null);
      try {
        const u = await getUsers();
        if (!mounted) return;
        setUsers(u);
        // si hay al menos 1 usuario, opcionalmente seleccionar el primero
        if (u.length > 0 && !selectedUser) setSelectedUser(u[0].userName);
      } catch (err: any) {
        if (!mounted) return;
        setUsersError(err?.message ?? "Error al cargar usuarios");
      } finally {
        if (!mounted) return;
        setLoadingUsers(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ejecuta solo al montar

  // handlers eliminados tras refactor a FieldInput/Select

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 text-center mb-4">Registrar Perfil Hotspot</h2>

      {/* usuarios loading / error */}
      {loadingUsers ? (
        <p className="mb-4 text-slate-500">Cargando usuarios...</p>
      ) : usersError ? (
        <p className="mb-4 text-red-500">{usersError}</p>
      ) : null}

      <Card>
        <CardBody className="space-y-4">
          {/* Select usuario */}
          <Select
            label="Usuario"
            value={selectedUser}
            onChangeValue={(v) => setSelectedUser(v)}
            options={[
              { value: "", label: "-- Selecciona un usuario --" },
              ...users.map((u) => ({ value: u.userName, label: `${u.userName}${u.fullName ? ` — ${u.fullName}` : ""}` }))
            ]}
            required
          />

          {/* name */}
          <FieldInput
            name="name"
            type="text"
            label="Nombre del perfil"
            value={form.name}
            setValue={(v) => setForm((s) => ({ ...s, name: v }))}
          />

          {/* uptime */}
          <FieldInput
            name="uptime"
            type="text"
            label="Uptime"
            value={form.uptime}
            setValue={(v) => setForm((s) => ({ ...s, uptime: v }))}
          />

          {/* server (disabled) */}
          <FieldInput
            name="server"
            type="text"
            label="Servidor"
            value={form.server}
            setValue={(v) => setForm((s) => ({ ...s, server: v }))}
            disabled
          />

          {/* mensajes */}
          {submitError && <p className="text-red-600 text-sm">{submitError}</p>}

          <div className="flex gap-2">
            <Button type="submit" onClick={handleSubmit as any} fullWidth isLoading={creating} disabled={creating}>
              Crear Perfil
            </Button>
            <Button type="button" variant="outline" onClick={() => setForm(formDataInitial)}>
              Limpiar
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateProfile;
