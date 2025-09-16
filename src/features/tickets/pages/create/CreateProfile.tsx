// src/features/tickets/pages/create/CreateProfile.tsx
import React, { useEffect, useState } from "react";
import { useProfilesApi } from "@/hooks/useProfilesApi";
import { useUsersApi } from "@/hooks/useUserApi";
import type { User } from "@/types/User.type";
import { useTickets } from "@/context/TicketsContext";
import { useFormHandler } from '@/hooks/useFormHandler';

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

  // handlers
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Registrar Perfil Hotspot</h2>

      {/* usuarios loading / error */}
      {loadingUsers ? (
        <p className="mb-4 text-gray-500">Cargando usuarios...</p>
      ) : usersError ? (
        <p className="mb-4 text-red-500">{usersError}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        {/* Select usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">-- Selecciona un usuario --</option>
            {users.map((u) => (
              <option key={u.userName} value={u.userName} className="capitalize">
                {u.userName} {u.fullName ? `— ${u.fullName}` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del perfil</label>
          <input
            name="name"
            value={form.name}
            onChange={handleInput}
            placeholder="Ej: 1hr"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        {/* uptime */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Uptime</label>
          <input
            name="uptime"
            value={form.uptime}
            onChange={handleInput}
            placeholder="Ej: 01:00:00"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        {/* server */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Servidor</label>
          <input
            name="server"
            value={form.server}
            onChange={handleInput}
            placeholder="Ej: Wifi Por Hora"
            className="mt-1 block w-full border-gray-400 bg-gray-400 rounded-md shadow-sm p-2"
            disabled
          />
        </div>

        {/* mensajes */}
        {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={creating}
            className="flex-1 py-2 px-4 bg-[var(--color-primary-600)] text-white rounded-md disabled:opacity-60"
          >
            {creating ? "Creando perfil..." : "Crear Perfil"}
          </button>

          <button
            type="button"
            onClick={() =>
              setForm({ name: "", uptime: "01:00:00", server: "Wifi Por Hora" })
            }
            className="py-2 px-4 border rounded-md"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProfile;
