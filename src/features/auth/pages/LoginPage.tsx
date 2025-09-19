import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/features/auth/components/LoginForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Card, { CardBody } from "@/components/ui/Card";
import { H2 } from "@/components/ui/Typography";
import Logo from "@/components/ui/Logo";

const LoginPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-50 px-4">
      <div className="flex justify-center -mt-24 mb-6">
        <Logo asLink={false} tone="dark" size="lg" />
      </div>
      <Card className="w-full max-w-md pb-6">
        <CardBody>
          <H2 className="text-center uppercase mb-4">Iniciar sesión</H2>
          <LoginForm />
        </CardBody>
      </Card>

    </div>
  );
};

export default LoginPage;