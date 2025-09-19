// src/features/auth/components/LoginForm.tsx
import React, { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import FieldInput from "@/components/ui/FieldInput";
import Button from "@/components/ui/Button";
import { P } from "@/components/ui/Typography";
import { FiEye, FiEyeOff } from "react-icons/fi";



const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);


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
            <FieldInput
                name="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={password}
                setValue={setPassword}
                rightAdornment={
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-slate-600 hover:text-slate-900 p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                }
            />

            <Button type="submit" disabled={isLoading} fullWidth>
                {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>

            {error && (
                <P className="text-center" variant="danger" size="sm">
                    {error}
                </P>
            )}

        </form>
    );
};


export default LoginForm;