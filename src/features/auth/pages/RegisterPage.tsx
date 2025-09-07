import React from "react";
import RegisterForm from "@/features/auth/components/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl text-gray-900 font-bold uppercase mb-6">Registro de Nuevo Usuario</h1>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;