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
    <aside className="flex md:flex-col w-auto md:w-60 border-r shadow-sm">
      <nav className="flex-1 p-4 space-y-2">
        {sections.map((section) => (
          <NavLink
            key={section.path}
            to={section.path}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full px-4 py-2 rounded-md font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {section.icon}
            <span className="hidden md:block">{section.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

