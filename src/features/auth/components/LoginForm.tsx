// src/features/auth/components/LoginForm.tsx
import React, { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import FieldInput from "@/components/ui/FieldInput";
import Button from "@/components/ui/Button";



const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading } = useAuth();
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
        } catch (err: any) {
            if (err.code === "auth/invalid-credential") {
                setError("Correo o contraseña incorrectos.");
            } else {
                setError(err.message || "Error al iniciar sesión.");
            }
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FieldInput name="email" label="Correo" type="email" value={email} setValue={setEmail} />
            <FieldInput name="password" label="Contraseña" type="password" value={password} setValue={setPassword} />

            <Button type="submit" disabled={isLoading} >
                {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>

            {error && <p className="text-center text-red-600 text-sm">{error}</p>}

        </form>
    );
};


export default LoginForm;