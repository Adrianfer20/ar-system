import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
// Use Card wrapper for client sections
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import FieldInput from "@/components/ui/FieldInput";
import Button from "@/components/ui/Button";
import { H2, P } from "@/components/ui/Typography";
import { useUsersApi } from "@/hooks/useUserApi";
import type { User } from "@/types/User.type";
import type { Role } from "@/types/Role";
import Select from "@/components/ui/Select";
import { changeOwnPassword } from "@/features/auth/services/auth.service";
import { Page, PageHeader } from "@/components/ui/Page";
import { PageSection, PageSectionHeader } from "@/components/ui/Section";

type AdminEditableUser = User & { role?: Role; emailVerified?: boolean; uid?: string };

const ClientSection: React.FC = () => {
    const { user } = useAuth();
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
            setMsg("Contraseña actualizada con éxito.");
            setCurPass(""); setNewPass("");
        } catch (e: any) {
            setErr(e?.message || "Error al cambiar contraseña");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Tarjeta con los detalles del usuario */}
            <Card>
                <CardHeader>
                    <H2>Tus Detalles</H2>
                </CardHeader>
                <CardBody className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {user?.email ?? "-"}</p>
                    <p><strong>Nombre:</strong> {user?.displayName ?? "-"}</p>
                    <p><strong>Rol:</strong> <span className="capitalize">{user?.role}</span></p>
                </CardBody>
            </Card>

            {/* Tarjeta con el formulario de cambio de contraseña */}
            <Card>
                <CardHeader>
                    <H2 className="text-center">
                        Cambiar Contraseña
                    </H2>
                </CardHeader>
                <CardBody>
                    <form onSubmit={(e) => { e.preventDefault(); onChangePassword(); }} className="space-y-4">
                        <FieldInput label="Contraseña actual" name="currentPassword" type="password" value={curPass} setValue={setCurPass} />
                        <FieldInput label="Nueva contraseña" name="newPassword" type="password" value={newPass} setValue={setNewPass} />
                        <div>
                            <Button type="submit" isLoading={loading} fullWidth>Actualizar Contraseña</Button>
                        </div>
                        {msg && <P className="text-green-600 text-sm">{msg}</P>}
                        {err && <P className="text-red-600 text-sm">{err}</P>}
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

const AdminSection: React.FC = () => {
    const { getUsers, updateUser, resetPasswordByEmail } = useUsersApi();
    const [users, setUsers] = useState<AdminEditableUser[]>([]);
    const [selected, setSelected] = useState<string>("");
    const [form, setForm] = useState<Partial<AdminEditableUser>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const all = await getUsers();
            const clients = (all as AdminEditableUser[]).filter(u => u.role === 'client');
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
        setForm(selectedUser ?? {});
        setError(null);
        setSuccess(null);
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
                userName: form.userName,
                fullName: form.fullName,
                email: form.email,
                tlfn: form.tlfn,
            });
            setSuccess("Usuario actualizado con éxito.");
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
            setSuccess("Se envió un correo para restablecer la contraseña.");
        } catch (e: any) {
            setError(e?.message || "No se pudo enviar el correo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageSection>
                <PageSectionHeader title="Seleccionar Cliente" />
                <div className="mt-4">
                    <Select
                        label="Clientes"
                        value={selected}
                        onChangeValue={setSelected}
                        options={[{ value: "", label: "Seleccionar..." }, ...users.map((u) => ({ value: u.userName, label: u.userName }))]}
                    />
                </div>
            </PageSection>

            {selectedUser && (
                <PageSection>
                    <PageSectionHeader title={`Editar Cliente: ${selectedUser.userName}`} />
                    <form onSubmit={onSave} className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FieldInput type="text" label="Nombre de usuario" name="userName" value={form.userName ?? ""} setValue={(v) => onChange("userName", v)} />
                            <FieldInput type="text" label="Nombre completo" name="fullName" value={form.fullName ?? ""} setValue={(v) => onChange("fullName", v)} />
                            <FieldInput type="email" label="Correo" name="email" value={form.email ?? ""} setValue={(v) => onChange("email", v)} />
                            <FieldInput type="text" label="Teléfono" name="tlfn" value={form.tlfn ?? ""} setValue={(v) => onChange("tlfn", v)} />
                        </div>
                        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-slate-200">
                            <Button type="submit" isLoading={loading} disabled={!selected} fullWidth>Guardar Cambios</Button>
                            <Button variant="outline" type="button" onClick={onResetPassword} disabled={!selected || loading} fullWidth>Enviar Reset Contraseña</Button>
                        </div>
                        {error && <P className="text-red-600 text-sm mt-2">{error}</P>}
                        {success && <P className="text-green-600 text-sm mt-2">{success}</P>}
                    </form>
                </PageSection>
            )}
        </div>
    );
};

const SettingsPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <Page>
            <PageHeader title="Ajustes" subtitle="Gestiona tu cuenta y la configuración de la aplicación." />
                    {/* Quitar card externo para evitar bg-white único */}
                    <PageSection noCard>
                        {user?.role === "admin" ? <AdminSection /> : <ClientSection />}
                    </PageSection>
        </Page>
    );
};

export default SettingsPage;