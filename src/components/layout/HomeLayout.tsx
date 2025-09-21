import { Outlet } from "react-router-dom";
import { FiUsers, FiFileText, FiArchive, FiTag } from "react-icons/fi";
import Sidebar from "./Sidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";

const HomeLayout = () => {
  const { user } = useAuth();
  const sections = [
    { path: "/", label: "Ventas", icon: <FiFileText /> },
    { path: "/tickets", label: "Tickets", icon: <FiTag /> },
    { path: "/clientes", label: "Clientes", icon: <FiUsers /> },
    // Mostrar 'Registro' solo si es admin
    ...(user?.role === "admin" ? [{ path: "/register", label: "Registro", icon: <FiArchive /> }] : []),

  ];


  return (
      <div className="h-full flex flex-1 min-w-0">
        <Sidebar sections={sections} />
        <main className="flex-1 min-w-0 overflow-auto pb-28">
          <Outlet />
        </main>
      </div>
  );
};

export default HomeLayout;


