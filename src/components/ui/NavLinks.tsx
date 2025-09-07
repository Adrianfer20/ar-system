import { Link } from "react-router-dom";

/* 🔹 Componente: Links (Desktop & Mobile) */
const NavLinks: React.FC<{
  links: { label: string; to?: string }[];
  onClick?: () => void;
}> = ({ links, onClick }) => {
  return (
    <>
      {links.map((link) =>
        link.to ? (
          <Link
            key={link.label}
            to={link.to}
            onClick={onClick}
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition"
          >
            {link.label}
          </Link>
        ) : (
          <button
            key={link.label}
            onClick={onClick}
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition"
          >
            {link.label}
          </button>
        )
      )}
    </>
  );
};
export default NavLinks;