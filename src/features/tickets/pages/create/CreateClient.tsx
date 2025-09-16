// src/features/tickets/pages/create/CreateClient.tsx
import React, { useState, useCallback } from "react";
import FieldInput from "@/components/ui/FieldInput";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { Role } from "@/types/Role";
import { useUsersApi } from "@/hooks/useUserApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTickets } from "@/context/TicketsContext";
import { useFormHandler } from '@/hooks/useFormHandler';

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
  const { user: currentUser } = useAuth(); // Renombrado para evitar conflicto
  const { createUser } = useUsersApi();
  const { getAllTickets } = useTickets();

  const [role, setRole] = useState<Role>("client");
  const [formData, setFormData] = useState<FormData>(initialFormState);

  const { handleSubmit: submitForm, loading, error } = useFormHandler({
    onSubmit: async (data: FormData) => {
      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("Solo un admin puede registrar nuevos usuarios.");
      }
      await createUser({ ...data, role });
      setFormData(initialFormState);
      getAllTickets();
    },
    onSuccess: () => setActiveTab("info"),
    successMessage: 'El Cliente se ha registrado correctamente',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(formData);
  };

  const handleChange = useCallback((name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

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
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            📝 Registrar Cliente
          </h2>
          <div className="space-y-4">
            {renderInput("userName", "Nombre de usuario")}
            {renderInput("fullName", "Nombre completo")}

            <Select
              label="Rol"
              value={role}
              onChangeValue={(value: string) => setRole(value as Role)}
              options={[
                { value: "client", label: "Cliente" },
                { value: "admin", label: "Admin" },
              ]}
              required
            />

            {renderInput("email", "Correo electrónico", "email")}
            {renderInput("password", "Contraseña", "password")}
            {renderInput("tlfn", "Teléfono")}
          </div>
        </div>

  <div className="bg-slate-50 px-6 py-4">
          <Button type="submit" fullWidth isLoading={loading} disabled={loading}>
            Registrar Cliente
          </Button>

          {error && (
            <p className="mt-3 text-center text-sm font-medium p-2 rounded-md bg-red-100 text-red-700">
              {error}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterClientPage;
