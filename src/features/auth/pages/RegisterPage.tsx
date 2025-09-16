import React from "react";
import RegisterForm from "@/features/auth/components/RegisterForm";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-xl font-semibold text-slate-900">Registro de nuevo usuario</h1>
        </CardHeader>
        <CardBody>
          <RegisterForm />
        </CardBody>
      </Card>
    </div>
  );
};

export default RegisterPage;