// BottomNavbar.tsx
import { Link, useLocation } from "react-router-dom";
import { navigation } from "./navigationConfig";

export default function BottomNavbar() {
  const location = useLocation();

  // 🔹 Detectar sección raíz actual
  const root = navigation.find((item) =>
    location.pathname.startsWith(item.path)
  );

  if (!root || !root.sections) return null;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around items-center py-2 md:hidden">
      {root.sections.map((section) => {
        const Icon = section.icon || (() => <span>•</span>);
        const isActive = location.pathname.startsWith(section.path);

        return (
          <Link
            key={section.path}
            to={section.path}
            className={`flex flex-col items-center text-xs ${
              isActive ? "text-primary font-bold" : "text-gray-500"
            }`}
          >
            <Icon />
            {section.title}
          </Link>
        );
      })}
    </nav>
  );
}



// import { Link, useLocation } from "react-router-dom";
// import type { JSX } from "react";

// type Section = {
//   id: string;
//   label: string;
//   icon: JSX.Element;
//   path: string;
// };

// const BottomNavbar = ({ sections }: { sections: Section[] }) => {
//   const location = useLocation();

//   return (
//     <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around items-center py-2">
//       {sections.map((section) => {
//         const isActive = location.pathname.startsWith(section.path);

//         return (
//           <Link
//             key={section.id}
//             to={section.path}
//             className={`flex flex-col items-center text-xs transition-colors ${
//               isActive ? "text-primary" : "text-gray-500 hover:text-primary"
//             }`}
//           >
//             {section.icon}
//             <span>{section.label}</span>
//           </Link>
//         );
//       })}
//     </nav>
//   );
// };

// export default BottomNavbar;
