import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";

const RootLayout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-primary-50 print:hidden">
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
};

export default RootLayout;
