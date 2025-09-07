// src/features/auth/components/RegisterForm.tsx
import React, { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Button from "@/components/ui/Button";
import FieldInput from "@/components/ui/FieldInput";
import FieldOption from "@/components/ui/FieldOption";
import type { Role } from "@/types/Role";



const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register, isLoading } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [role, setRole] = useState<Role>("client");



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await register(email, password, role);
            setSuccess("Usuario creado correctamente.");
            setEmail("");
            setPassword("");
        } catch (err) {
            setError("Error al registrar usuario.");
            console.error(err);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="min-w-sm rounded shadow space-y-6 px-4 py-8">

            <FieldInput
                label="Email"
                type="email"
                value={email}
                setValue={setEmail}
            />

            <FieldInput
                label="Contraseña"
                type="password"
                value={password}
                setValue={setPassword}
            />

            <FieldOption
                value={role}
                setValue={(value: string) => setRole(value as Role)}
                label="Rol"
                options={[
                    { value: "client", label: "Cliente" },
                    { value: "admin", label: "Admin" },
                ]}
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <Button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {isLoading ? "Cargando..." : "Registrar"}
            </Button>
        </form>
    );
};


export default RegisterForm;
