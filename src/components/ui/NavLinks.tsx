import { NavLink } from "react-router-dom";
import React from "react";

const NavLinks: React.FC<{
  links: { label: string; to: string; icon?: React.ReactNode }[];
  onClick?: () => void;
  className?: string;
  activeClassName?: string;
}> = ({ links, onClick, className, activeClassName }) => {
  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.label}
          to={link.to}
          onClick={onClick}
          className={({ isActive }) =>
            `${className} ${isActive ? activeClassName : ""}`
          }
        >
          {link.icon && <span className="mr-2">{link.icon}</span>}
          {link.label}
        </NavLink>
      ))}
    </>
  );
};

export default NavLinks;