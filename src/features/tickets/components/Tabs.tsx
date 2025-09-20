// components/Tabs.tsx
import React, { useRef } from "react";
import clsx from "clsx";

type Tab = {
  id: string;
  label: string;
  /** Icono opcional a la izquierda del label */
  icon?: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  /** Clase extra opcional para el contenedor */
  className?: string;
  /** Hace sticky la barra de tabs (top-0, fondo blanco) */
  sticky?: boolean;
};

/**
 * Tabs mobile-first
 * - Píldoras responsivas que se ajustan al contenedor.
 * - Accesible (ARIA roles) y navegable con teclado (←/→/Home/End)
 */
const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className, sticky = false }) => {
  const listRef = useRef<HTMLUListElement | null>(null);

  const handleKeyDown: React.KeyboardEventHandler<HTMLUListElement> = (e) => {
    const list = listRef.current;
    if (!list) return;
    const focusable = Array.from(list.querySelectorAll<HTMLButtonElement>("button[role='tab']"));
    const currentIndex = focusable.findIndex((b) => b === document.activeElement);

    const moveFocus = (nextIndex: number) => {
      const el = focusable[(nextIndex + focusable.length) % focusable.length];
      el?.focus();
    };

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        moveFocus(currentIndex + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveFocus(currentIndex - 1);
        break;
      case "Home":
        e.preventDefault();
        moveFocus(0);
        break;
      case "End":
        e.preventDefault();
        moveFocus(focusable.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <nav aria-label="Tabs" className={clsx("bg-white p-1 rounded-lg shadow-sm border border-slate-200", sticky && "sticky top-0 z-10")}>
      <ul
        ref={listRef}
        role="tablist"
        onKeyDown={handleKeyDown}
        className={clsx(
          "relative grid grid-cols-2 md:grid-cols-4 items-center justify-start gap-1",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <li key={tab.id}>
              <button
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`tab-panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                data-tab-id={tab.id}
                onClick={() => onChange(tab.id)}
                className={clsx(
                  "inline-flex items-center justify-center w-full px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 cursor-pointer",
                  isActive
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                )}
              >
                {tab.icon && (
                  <span aria-hidden className={clsx("mr-2", isActive ? "text-white" : "text-slate-500")}>
                    {tab.icon}
                  </span>
                )}
                <span className="truncate">{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Tabs;
