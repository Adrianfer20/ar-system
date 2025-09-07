// src/features/users/pages/RegisterClientPage.tsx
import React, { useState, useCallback } from "react";
import FieldInput from "@/components/ui/FieldInput";
import FieldOption from "@/components/ui/FieldOption";
import type { Role } from "@/types/Role";
import { useUsersApi } from "@/hooks/useUserApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import toast from "react-hot-toast";
import { useTicketsApi } from "@/hooks/useTicketsApi";

interface FormData {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  tlfn: string;
}

const initialFormState: FormData = {
  userName: "",
  fullName: "",
  email: "",
  password: "",
  tlfn: "",
};

interface ChildProps {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}


const RegisterClientPage: React.FC<ChildProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { createUser, loading } = useUsersApi();
  const { getAllTickets } = useTicketsApi();


  const [role, setRole] = useState<Role>("client");
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = useCallback((name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    try {
      console.log(user)
      if (!user || user.role !== "admin") {
        throw new Error("Solo un admin puede registrar nuevos usuarios.");
      }

      await createUser({ ...formData, role });
      setFormData(initialFormState);
      getAllTickets();
      toast.success('El Cliente se ha registrado correctamente');
      setActiveTab("info");
    } catch (err) {
      const message = err instanceof Error ? err.message : "❌ Error al registrar el cliente.";
      setFeedback({ type: "error", message });
    }
  };

  const renderInput = (
    name: keyof FormData,
    label: string,
    type: "text" | "email" | "password" = "text"
  ) => (
    <FieldInput
      type={type}
      label={label}
      name={name}
      value={formData[name]}
      setValue={(value: string) => handleChange(name, value)}
    />
  );

  return (
    <div className="max-w-lg mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📝 Registrar Cliente
          </h2>
          <div className="space-y-4">
            {renderInput("userName", "Nombre de usuario")}
            {renderInput("fullName", "Nombre completo")}

            <FieldOption
              value={role}
              setValue={(value: string) => setRole(value as Role)}
              label="Rol"
              options={[
                { value: "client", label: "Cliente" },
                { value: "admin", label: "Admin" },
              ]}
            />

            {renderInput("email", "Correo electrónico", "email")}
            {renderInput("password", "Contraseña", "password")}
            {renderInput("tlfn", "Teléfono")}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary-600 text-white font-semibold rounded-md 
                       hover:bg-primary-700 transition shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Registrando..." : "Registrar Cliente"}
          </button>

          {feedback && (
            <p
              className={`mt-3 text-center text-sm font-medium p-2 rounded-md ${feedback.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
                }`}
            >
              {feedback.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterClientPage;
