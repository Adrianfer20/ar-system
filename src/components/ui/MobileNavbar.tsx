import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";

/* 🔹 Componente: Menú móvil */
const MobileNavbar: React.FC<{
  isOpen: boolean;
  links: { label: string; to?: string }[];
  handleLogout: () => void;
  closeMenu: () => void;
}> = ({ isOpen, links, handleLogout, closeMenu }) => {
  if (!isOpen) return null;

  return (
    <div className=" md:hidden bg-primary text-light shadow-md transition-all duration-200">
      <ul className="flex flex-col space-y-1 p-4">
        {links.map((link) =>
          link.to ? (
            <li key={link.label}>
              <Link
                to={link.to}
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition"
              >
                {link.label}
              </Link>
            </li>
          ) : (
            <li key={link.label}>
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition"
              >
                {link.label}
              </button>
            </li>
          )
        )}

        {/* Botón Cerrar Sesión */}
        <li>
          <button
            onClick={() => {
              handleLogout();
              closeMenu();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 transition"
          >
            <FiLogOut size={20} />
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </div>
  );
};


export default MobileNavbar;