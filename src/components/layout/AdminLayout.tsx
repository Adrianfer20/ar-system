import { Outlet } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  const sections = [
    { path: "/settings", label: "Configuraciones", icon: <FiSettings /> },
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

export default AdminLayout;