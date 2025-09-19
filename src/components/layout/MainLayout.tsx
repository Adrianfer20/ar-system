import { Outlet } from "react-router-dom";
import { FiUsers, FiFileText, FiSettings, FiArchive, FiTag } from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "./Sidebar";
import { Toaster } from "react-hot-toast";

const MainLayout = () => {
  const sections = [
  { path: "/", label: "Ventas", icon: <FiFileText /> },
  { path: "/tickets", label: "Tickets", icon: <FiTag /> },
  { path: "/clientes", label: "Clientes", icon: <FiUsers /> },
  { path: "/register", label: "Registro", icon: <FiArchive /> },
  { path: "/settings", label: "Ajustes", icon: <FiSettings /> },
  ];
  

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-primary-50 print:hidden">
      {/* Navbar superior */}
      <Navbar />

      {/* Sidebar + contenido */}
      <div className="h-full flex flex-1 min-w-0">
        <Sidebar sections={sections} />
        <main className="flex-1 min-w-0 overflow-auto pb-28">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;


