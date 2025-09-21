

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiLogOut, FiHome, FiSettings, FiLogIn } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import NavLinks from "../ui/NavLinks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Logo from "@/components/ui/Logo";

const adminLinks = [
  { label: "Home", to: "/", icon: <FiHome /> },
  { label: "Configuración", to: "/settings", icon: <FiSettings /> },
];

const userLinks = [
  { label: "Home", to: "/", icon: <FiHome /> },
  { label: "Configuración", to: "/settings", icon: <FiSettings /> },
];

const guestLinks = [{ label: "Iniciar sesión", to: "/login", icon: <FiLogIn /> }];

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = user
    ? user.role === "admin"
      ? adminLinks
      : userLinks
    : guestLinks;

  const isRegisterPage =
    location.pathname === "/products/register" ||
    location.pathname === "/products/sale";

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="relative w-full bg-primary text-light z-30 shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" tone="light" />
            {isRegisterPage && (
              <button
                onClick={() => navigate(-1)}
                className="text-white p-2 rounded-md hover:bg-white/10"
              >
                <FaArrowLeft size={20} />
              </button>
            )}
          </div>

          {!isRegisterPage && (
            <>
              <div className="hidden md:flex space-x-2 items-center">
                <NavLinks
                  links={navLinks}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-light hover:bg-white/10 transition"
                  activeClassName="bg-white/20"
                />
                {user && (
                  <button
                    onClick={logout}
                    className="p-2 rounded-full text-light hover:bg-white/10 transition"
                    aria-label="Cerrar Sesión"
                  >
                    <FiLogOut size={20} />
                  </button>
                )}
              </div>

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

      {/* Mobile Menu */}
      {isOpen && !isRegisterPage && (
        <div className="absolute w-full md:hidden bg-primary-900/60 backdrop-blur-sm shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLinks
              links={navLinks}
              onClick={closeMenu}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-light hover:bg-white/10 transition"
              activeClassName="bg-white/20"
            />
            {user && (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-light hover:bg-white/10 transition"
              >
                <FiLogOut size={20} />
                Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

