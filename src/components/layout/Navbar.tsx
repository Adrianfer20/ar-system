

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import NavLinks from "../ui/NavLinks";
import MobileNavbar from "../ui/MobileNavbar";
import { useAuth } from "@/features/auth/hooks/useAuth";

/* 🔹 Links según rol */
const adminLinks = [
  { label: "Home", to: "/" },
  { label: "Configuración", to: "/settings" },
];

const userLinks = [{ label: "Perfil", to: "/settings" }];
const guestLinks = [{ label: "Iniciar sesión", to: "/login" }];




/* 🔹 Componente principal Navbar */
const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // 🔸 Selección de links según estado
  const navLinks = user ? (user.role === "admin" ? adminLinks : userLinks) : guestLinks;

  

  // 🔸 Páginas donde ocultar menú (ej: register, sale)
  const isRegisterPage =
    location.pathname === "/products/register" ||
    location.pathname === "/products/sale";


  return (
    <nav className="w-full bg-primary text-light z-30 shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Botón Volver */}
          <div
            className={
              isRegisterPage
                ? "w-full flex justify-between items-center space-x-4"
                : "flex items-center gap-4"
            }
          >
            <Link to="/products" className="text-xl font-extrabold text-white uppercase">
              A<span className="text-yellow-500">|</span>R System
            </Link>

            {isRegisterPage && (
              <button
                onClick={() => navigate(-1)}
                className="text-white p-2 rounded-md hover:bg-white/10"
              >
                <FaArrowLeft size={20} />
              </button>
            )}
          </div>

          {/* Menú Desktop */}
          {!isRegisterPage && (
            <>
              <div className="hidden md:flex space-x-6 items-center">
                <NavLinks links={navLinks} />
                {user && (
                  <button
                    onClick={logout}
                    className="relative p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
                  >
                    <span className="sr-only">Cerrar Sesión</span>
                    <FiLogOut size={20} />
                  </button>
                )}
              </div>

              {/* Botón menú móvil */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-md text-white hover:bg-white/10 focus:outline-none transition"
                >
                  {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Menú Mobile */}
      {!isRegisterPage && (
        <MobileNavbar
          isOpen={isOpen}
          links={navLinks}
          handleLogout={logout}
          closeMenu={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;

