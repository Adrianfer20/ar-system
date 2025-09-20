import React, { useMemo, useState } from "react";
import { useUsersData } from "../../hooks/useUsersData";
import { useProfilesData } from "../../hooks/useProfilesData";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";
import { H2, P } from "@/components/ui/Typography";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useTickets } from "@/context/TicketsContext";
import type { Code } from "@/types/Code.type";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ChildProps {
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

// Extrae name="..." de líneas tipo: me="5vfflm" server="Wifi Por Hora" profile="1hr" limit-uptime="01:00:00" add name="r1cowk" server="Wifi Por Hora" profile="1hr" limit-uptime="01:00:00"
function parseNames(input: string): string[] {
    const names: string[] = [];
    const regex = /\bname\s*=\s*"([^"]+)"/gi;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(input)) !== null) {
        names.push(match[1]);
    }
    return Array.from(new Set(names)); // evitar duplicados
}

function toCodes(names: string[]): Code[] {
    return names.map((n) => ({
        code: n,
        status: false,
        usedAt: { _seconds: 0, _nanoseconds: 0 },
    }));
}

const ImportTickets: React.FC<ChildProps> = ({ setActiveTab }) => {
    const { importCodes, getAllTickets } = useTickets();
    const { user } = useAuth();
    const { users, loading: loadingUsers } = useUsersData();

    const [selectedUser, setSelectedUser] = useState("");
    const { profiles, loading: loadingProfiles } = useProfilesData(selectedUser);
    const [selectedProfile, setSelectedProfile] = useState("");

    const [rawText, setRawText] = useState("");

    const extractedNames = useMemo(() => parseNames(rawText), [rawText]);
    const codes: Code[] = useMemo(() => toCodes(extractedNames), [extractedNames]);

    const { handleSubmit: submitForm, loading: submitting, error } = useFormHandler({
        onSubmit: async () => {
            if (!selectedUser || !selectedProfile) throw new Error("Selecciona usuario y perfil.");
            if (codes.length === 0) throw new Error("No se detectaron códigos en el texto pegado.");
            await importCodes(selectedUser, selectedProfile, codes);
            setRawText("");
            setSelectedUser("");
            setSelectedProfile("");
            await getAllTickets();
        },
        onSuccess: () => setActiveTab("tickets"),
        successMessage: "✅ Códigos importados correctamente",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitForm({});
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <form onSubmit={handleSubmit} noValidate aria-busy={loadingUsers || loadingProfiles || submitting}>
                    <CardBody className="min-w-0 space-y-4">
                        <H2 className="mb-4">Importar tickets desde texto</H2>

                        {/* Usuario */}
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

                        <div>
                            <label className="block text-sm font-medium mb-1">Pega el texto exportado</label>
                            <textarea
                                value={rawText}
                                onChange={(e) => setRawText(e.target.value)}
                                placeholder='me="5vfflm" server="Wifi Por Hora" profile="1hr" limit-uptime="01:00:00" add name="r1cowk" server="Wifi Por Hora" profile="1hr" limit-uptime="01:00:00"\nme="abcd" add name="efgh" ...'
                                className="w-full min-h-40 resize-y rounded-md border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                            />
                            <P className="text-xs text-slate-500 mt-1">
                                Solo se extraerán los valores de name="...". Se ignorará el resto.
                            </P>
                        </div>

                        {rawText && (
                            <div className="text-sm text-slate-700">
                                Detectados: <strong>{codes.length}</strong> códigos
                            </div>
                        )}
                    </CardBody>

                    <div className="bg-slate-50 px-6 py-4">
                        <Button
                            type="submit"
                            fullWidth
                            disabled={!selectedUser || !selectedProfile || codes.length === 0 || submitting || user?.role !== 'admin'}
                            isLoading={submitting}
                        >
                            Importar códigos
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

export default ImportTickets;
