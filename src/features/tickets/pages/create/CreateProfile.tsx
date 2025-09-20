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
import { H2, P } from "@/components/ui/Typography";
import { useAuth } from "@/features/auth/hooks/useAuth";

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
  const { user } = useAuth();


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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        if (u.length > 0 && !selectedUser) setSelectedUser(u[0].userName);
      } catch (err: unknown) {
        if (!mounted) return;
        setUsersError(err instanceof Error ? err.message : "Error al cargar usuarios");
      } finally {
        if (!mounted) return;
        setLoadingUsers(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <form onSubmit={handleSubmit} noValidate aria-busy={loadingUsers || creating}>
          <CardBody className="min-w-0 space-y-4">
            <H2 className="mb-4">Registrar perfil hotspot</H2>

            {/* Estado de error arriba del formulario */}
            {usersError && (
              <P className="-mt-2" variant="danger">{usersError}</P>
            )}

            {loadingUsers ? (
              // Skeletons para mantener layout estable
        <div className="space-y-4 animate-pulse">
                <div>
          <div className="h-4 w-24 sm:w-36 bg-slate-200 rounded mb-2" />
          <div className="h-10 w-full max-w-full bg-slate-200 rounded" />
                </div>
                <div>
          <div className="h-4 w-28 sm:w-40 bg-slate-200 rounded mb-2" />
          <div className="h-10 w-full max-w-full bg-slate-200 rounded" />
                </div>
                <div>
          <div className="h-4 w-20 sm:w-24 bg-slate-200 rounded mb-2" />
          <div className="h-10 w-full max-w-full bg-slate-200 rounded" />
                </div>
                <div>
          <div className="h-4 w-24 sm:w-28 bg-slate-200 rounded mb-2" />
          <div className="h-10 w-full max-w-full bg-slate-200 rounded" />
                </div>
              </div>
            ) : (
              <>
                {/* Select usuario */}
                <Select
                  label="Usuario"
                  value={selectedUser}
                  onChangeValue={(v) => setSelectedUser(v)}
                  options={[
                    { value: "", label: "-- Selecciona un usuario --" },
                    ...users.map((u) => ({ value: u.userName, label: `${u.userName}${u.fullName ? ` — ${u.fullName}` : ""}` }))
                  ]}
                  placeholder="Selecciona un usuario"
                  disabled={loadingUsers}
                  required
                />

                {/* name */}
                <FieldInput
                  name="name"
                  type="text"
                  label="Nombre del perfil"
                  value={form.name}
                  setValue={(v) => setForm((s) => ({ ...s, name: v }))}
                  disabled={loadingUsers}
                />

                {/* uptime */}
                <FieldInput
                  name="uptime"
                  type="text"
                  label="Uptime"
                  value={form.uptime}
                  setValue={(v) => setForm((s) => ({ ...s, uptime: v }))}
                  disabled={loadingUsers}
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
              </>
            )}
          </CardBody>

          <div className="bg-slate-50 px-6 py-4" aria-live="polite">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="submit" fullWidth isLoading={creating} disabled={creating || loadingUsers || user?.role !== 'admin'}>
                Crear perfil
              </Button>
              <Button type="button" variant="outline" onClick={() => setForm(formDataInitial)} disabled={loadingUsers}>
                Limpiar
              </Button>
            </div>
            {submitError && (
              <P className="mt-3 text-center text-sm font-medium p-2 rounded-md bg-red-100" variant="danger">
                {submitError}
              </P>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateProfile;
