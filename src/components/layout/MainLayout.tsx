import { Outlet } from "react-router-dom";
import { FiHome, FiUsers, FiFileText, FiSettings } from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";

const MainLayout = () => {
  const sections = [
    { path: "/", label: "Ventas", icon: <FiFileText size={20} /> },
    { path: "/tickets", label: "Tickets", icon: <FiHome size={20} /> },
  { path: "/clientes", label: "Clientes", icon: <FiUsers size={20} /> },
    { path: "/register", label: "Registro", icon: <FiUsers size={20} /> },
    { path: "/settings", label: "Ajustes", icon: <FiSettings size={20} /> },
  ];
  

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-primary-50 print:hidden">
      {/* Navbar superior */}
      <Navbar />

      {/* Sidebar + contenido */}
      <div className="h-full flex flex-1">
        <Sidebar sections={sections} />
        <main className="flex-1 p-4 overflow-auto pb-28">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;


