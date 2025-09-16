// src/features/auth/components/RegisterForm.tsx
import React, { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Button from "@/components/ui/Button";
import FieldInput from "@/components/ui/FieldInput";
import Select from "@/components/ui/Select";
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
        <form onSubmit={handleSubmit} className="space-y-6">

            <FieldInput
                name="email"
                label="Correo"
                type="email"
                value={email}
                setValue={setEmail}
            />

            <FieldInput
                name="password"
                label="Contraseña"
                type="password"
                value={password}
                setValue={setPassword}
            />

            <Select
                label="Rol"
                value={role}
                onChangeValue={(value: string) => setRole(value as Role)}
                options={[
                    { value: "client", label: "Cliente" },
                    { value: "admin", label: "Admin" },
                ]}
              />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}
            <Button type="submit" disabled={isLoading} >
                {isLoading ? "Cargando..." : "Registrar"}
            </Button>
        </form>
    );
};


export default RegisterForm;
