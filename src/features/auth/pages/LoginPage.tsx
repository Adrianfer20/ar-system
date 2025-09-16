import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/features/auth/components/LoginForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";

const LoginPage: React.FC = () => {
  const { user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-xl font-semibold text-slate-900">Iniciar sesión</h1>
        </CardHeader>
        <CardBody>
          <LoginForm />
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;