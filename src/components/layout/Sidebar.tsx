import { NavLink } from "react-router-dom";

type Section = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

type SidebarProps = {
  sections: Section[];
};

const Sidebar: React.FC<SidebarProps> = ({ sections }) => {
  return (
    <aside className="flex md:flex-col w-14 md:w-20 lg:w-60 flex-shrink-0 border-r shadow-sm">
      <nav className="flex-1 p-2 lg:p-4 space-y-2">
        {sections.map((section) => (
          <NavLink
            key={section.path}
            to={section.path}
            className={({ isActive }) =>
              `flex items-center justify-center lg:justify-start gap-0 lg:gap-3 w-full px-2 lg:px-4 py-2 rounded-md font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <span className="grid place-items-center text-[20px] lg:text-[22px]">
              {/* Icono inyectado: asegurar tamaño y heredar color del contenedor */}
              <span className="inline-flex text-current">{section.icon}</span>
            </span>
            <span className="hidden lg:block">{section.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

