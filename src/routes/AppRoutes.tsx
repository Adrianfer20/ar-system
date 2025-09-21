import { Routes, Route } from "react-router-dom";
import TicketsPage from "@/features/tickets/pages/TicketsPage";
import RegisterPage from "@/features/tickets/pages/RegisterPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import PrivateRoute from "./PrivateRoute";
import SalesPage from "@/features/tickets/pages/SalesPage";
import ClientesPage from "@/features/tickets/pages/ClientesPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import RootLayout from "@/components/layout/RootLayout";
import HomeLayout from "@/components/layout/HomeLayout";
import AdminLayout from "@/components/layout/AdminLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/settings" element={<AdminLayout />}>
          <Route index element={<SettingsPage />} />
        </Route>

        {/* Rutas privadas con layout principal */}
        <Route path="/" element={<HomeLayout />}>
          <Route index path="" element={<SalesPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          {/* Solo admin puede acceder a /register */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Route>
      </Route>
    </Route>
    </Routes >
  );
};

export default AppRoutes;
