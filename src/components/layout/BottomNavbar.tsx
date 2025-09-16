// BottomNavbar.tsx
// Placeholder sin dependencias externas. Implementar cuando exista navigationConfig o props.
export default function BottomNavbar() {
  return null;
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
