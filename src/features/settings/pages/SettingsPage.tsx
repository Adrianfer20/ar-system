import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Card, { CardBody } from "@/components/ui/Card";
import FieldInput from "@/components/ui/FieldInput";
import Button from "@/components/ui/Button";
import { H2, H3, P } from "@/components/ui/Typography";
import { useUsersApi } from "@/hooks/useUserApi";
import type { User } from "@/types/User.type";
import type { Role } from "@/types/Role";
import Select from "@/components/ui/Select";
import { changeOwnPassword } from "@/features/auth/services/auth.service";

type AdminEditableUser = User & { role?: Role; emailVerified?: boolean; uid?: string };

const ClientSection: React.FC = () => {
  const { user } = useAuth();
  // Solo lectura de detalles
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onChangePassword = async () => {
    setMsg(null); setErr(null);
    setLoading(true);
    try {
      if (!curPass || !newPass) throw new Error("Debes ingresar tu contraseña actual y la nueva");
      await changeOwnPassword(curPass, newPass);
      setMsg("Contraseña actualizada");
      setCurPass(""); setNewPass("");
    } catch (e: any) {
      setErr(e?.message || "Error al cambiar contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardBody className="space-y-2">
          <H2>Tus detalles</H2>
          <P className="text-sm"><strong>Email:</strong> {user?.email ?? "-"}</P>
          <P className="text-sm"><strong>Nombre:</strong> {user?.displayName ?? "-"}</P>
          <P className="text-sm"><strong>Rol:</strong> {user?.role}</P>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-4">
          <H2>Cambiar contraseña</H2>
          <FieldInput label="Contraseña actual" name="currentPassword" type="password" value={curPass} setValue={setCurPass} />
          <FieldInput label="Nueva contraseña" name="newPassword" type="password" value={newPass} setValue={setNewPass} />
          <div className="pt-2">
            <Button onClick={onChangePassword} isLoading={loading}>Actualizar contraseña</Button>
          </div>
          <P className="text-slate-500 text-xs">Por seguridad, se requiere reautenticación con tu contraseña actual.</P>
          {msg && <P className="text-green-600 text-sm">{msg}</P>}
          {err && <P className="text-red-600 text-sm">{err}</P>}
        </CardBody>
      </Card>
    </div>
  );
};

const AdminSection: React.FC = () => {
  const { user } = useAuth();
  const { getUsers, updateUser, resetPasswordByEmail } = useUsersApi();
  const [users, setUsers] = useState<AdminEditableUser[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [form, setForm] = useState<Partial<AdminEditableUser>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null); setSuccess(null); setLoading(true);
    try {
  const all = await getUsers();
  // Si el backend trae rol, opcionalmente filtra por role === 'client'; si no, usa tal cual.
  const clients = (all as unknown as AdminEditableUser[]).filter((u) => (u as any)?.role ? (u as any).role === 'client' : true);
  setUsers(clients);
    } catch (e: any) {
      setError(e?.message || "Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  }, [getUsers]);

  useEffect(() => { load(); }, [load]);

  const selectedUser = useMemo(() => users.find((u) => u.userName === selected) || null, [users, selected]);

  useEffect(() => {
    if (selectedUser) setForm(selectedUser);
  }, [selectedUser]);

  const onChange = (name: keyof AdminEditableUser, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setLoading(true); setError(null); setSuccess(null);
    try {
      await updateUser(selectedUser.userName, {
        userName: form.userName || selectedUser.userName,
        fullName: form.fullName || selectedUser.fullName,
        email: form.email || selectedUser.email,
        tlfn: form.tlfn || selectedUser.tlfn,
      });
      setSuccess("Usuario actualizado");
      await load();
    } catch (e: any) {
      setError(e?.message || "Error al actualizar usuario");
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async () => {
    if (!selectedUser?.email) return;
    setLoading(true); setError(null); setSuccess(null);
    try {
      await resetPasswordByEmail(selectedUser.email);
      setSuccess("Se envió un correo para restablecer contraseña");
    } catch (e: any) {
      setError(e?.message || "No se pudo enviar el correo de restablecimiento");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin") return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="space-y-4">
          <H2>Gestionar clientes</H2>
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
              <Select
                label="Selecciona cliente"
                value={selected}
                onChangeValue={setSelected}
                options={[{ value: "", label: "Selecciona" }, ...users.map((u) => ({ value: u.userName, label: u.userName }))]}
              />
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldInput type="text" label="Nombre de usuario" name="userName" value={form.userName ?? ""} setValue={(v) => onChange("userName", v)} />
              <FieldInput type="text" label="Nombre completo" name="fullName" value={form.fullName ?? ""} setValue={(v) => onChange("fullName", v)} />
              <FieldInput type="email" label="Correo" name="email" value={form.email ?? ""} setValue={(v) => onChange("email", v)} />
              <FieldInput type="text" label="Teléfono" name="tlfn" value={form.tlfn ?? ""} setValue={(v) => onChange("tlfn", v)} />
              <div className="flex gap-2 col-span-full">
                <Button onClick={onSave} isLoading={loading} disabled={!selected}>Guardar</Button>
                <Button variant="outline" onClick={onResetPassword} disabled={!selected || loading}>Enviar reset contraseña</Button>
              </div>
              {error && <P className="text-red-600 text-sm col-span-full">{error}</P>}
              {success && <P className="text-green-600 text-sm col-span-full">{success}</P>}
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <H3 className="mb-2">Detalles</H3>
          {selectedUser ? (
            <div className="text-sm space-y-1">
              <P><strong>Usuario:</strong> {selectedUser.userName}</P>
              <P><strong>Nombre:</strong> {selectedUser.fullName}</P>
              <P><strong>Email:</strong> {selectedUser.email}</P>
              <P><strong>Teléfono:</strong> {selectedUser.tlfn}</P>
            </div>
          ) : (
            <P>Selecciona un cliente para ver detalles.</P>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <H2>Ajustes</H2>
      {user?.role === "admin" ? <AdminSection /> : <ClientSection />}
    </div>
  );
};

export default SettingsPage;