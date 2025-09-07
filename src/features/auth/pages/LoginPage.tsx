import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/features/auth/components/LoginForm";
import { useAuth } from "@/features/auth/hooks/useAuth";

const LoginPage: React.FC = () => {
  const { user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl text-gray-900 font-bold uppercase mb-6">Iniciar Sesion</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;