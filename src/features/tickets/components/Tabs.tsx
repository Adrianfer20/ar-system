// components/Tabs.tsx
import React from "react";

type Tab = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
};

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <ul className="flex justify-between items-center md:justify-around bg-white shadow border border-gray-200">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <li
            key={tab.id}
            className={`text-sm text-center font-bold cursor-pointer px-4 py-2 transition-colors duration-200 ${
              isActive
                ? "bg-primary-100 text-primary shadow-md" // active solid
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => onChange(tab.id)}
          >
            <span className="font-medium">{tab.label}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default Tabs;
