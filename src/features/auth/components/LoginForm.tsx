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
        <form onSubmit={handleSubmit} className="min-w-sm rounded shadow space-y-6 px-4 py-8">
            <FieldInput label="correo" type="email" value={email} setValue={setEmail} />
            <FieldInput label="contraseña" type="password" value={password} setValue={setPassword} />

            <Button type="submit" disabled={isLoading} >
                {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>

            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        </form>
    );
};


export default LoginForm;