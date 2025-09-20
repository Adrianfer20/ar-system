import { Routes, Route } from "react-router-dom";
import TicketsPage from "@/features/tickets/pages/TicketsPage";
import MainLayout from "@/components/layout/MainLayout";
import RegisterPage from "@/features/tickets/pages/RegisterPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import PrivateRoute from "./PrivateRoute";
import SalesPage from "@/features/tickets/pages/SalesPage";
import ClientesPage from "@/features/tickets/pages/ClientesPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* Rutas privadas con layout principal */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index path="" element={<SalesPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          {/* Solo admin puede acceder a /register */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
