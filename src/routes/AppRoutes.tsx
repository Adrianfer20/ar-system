import { Routes, Route } from "react-router-dom";
import TicketsPage from "@/features/tickets/pages/TicketsPage";
import MainLayout from "@/components/layout/MainLayout";
import RegisterPage from "@/features/tickets/pages/RegisterPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import PrivateRoute from "./PrivateRoute";
import SalesPage from "@/features/tickets/pages/SalesPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {/* Rutas privadas con layout principal */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<TicketsPage />} />
          <Route path="reports" element={<SalesPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="settings" element={<p>Sección de Ajustes - En construcción</p>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
