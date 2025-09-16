// components/Tabs.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  /** Densidad visual */
  size?: "sm" | "md";
  /** Distribución en desktop */
  variant?: "left" | "justified";
};

/**
 * Tabs mobile-first
 * - Móvil: píldoras con scroll horizontal
 * - Desktop: estilo subrayado con borde inferior
 * - Accesible (ARIA roles) y navegable con teclado (←/→/Home/End)
 */
const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className, sticky = false, size = "md", variant = "left" }) => {
  const listRef = useRef<HTMLUListElement | null>(null);
  const ids = useMemo(() => tabs.map((t) => t.id), [tabs]);
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const isSm = size === "sm";

  // Asegura que el tab activo sea visible en móvil
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const activeIndex = ids.indexOf(activeTab);
    if (activeIndex === -1) return;
    const el = list.querySelector<HTMLButtonElement>(`button[data-tab-id="${activeTab}"]`);
    // Solo intentar scroll si el contenedor realmente desborda horizontalmente
    if (el && list.scrollWidth > list.clientWidth) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeTab, ids]);

  // Posicionar indicador animado en desktop
  useEffect(() => {
    const update = () => {
      const list = listRef.current;
      if (!list) return;
      const el = list.querySelector<HTMLButtonElement>(`button[data-tab-id="${activeTab}"]`);
      if (!el) return;
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeTab, tabs]);

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
  <nav aria-label="Tabs" className={clsx(sticky && "sticky top-0 z-10 bg-white")}> 
      <ul
        ref={listRef}
        role="tablist"
        onKeyDown={handleKeyDown}
    className={clsx(
  // Contenedor responsive: wrap en móvil (centrado), subrayado en md+
  "relative flex flex-wrap items-center justify-center border-b border-slate-200",
  isSm ? "gap-1 px-1 py-1" : "gap-2 px-1 py-2",
  "md:flex-nowrap md:gap-0 md:px-0 md:py-0",
  variant === "left" && "md:justify-start",
  variant === "justified" && "md:w-full",
          className
        )}
      >
        {/* Indicador animado: visible solo en desktop */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 hidden h-0.5 bg-primary-600 transition-all duration-300 ease-out md:block"
          style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
        />
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <li
              key={tab.id}
              className={clsx(
                "md:shrink md:basis-auto",
                variant === "justified" && "md:flex-1"
              )}
            >
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
                  // Base móvil: píldoras
                  "inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors cursor-pointer",
                  isSm ? "gap-1.5 px-2 py-1 text-xs" : "gap-2 px-3 py-2 text-sm",
                  "text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  // Activo en móvil: fondo primario
                  isActive && "bg-primary-600 text-white",
                  // Desktop: quitar píldora, usar subrayado
                  isSm ? "md:rounded-none md:px-3 md:py-2 md:hover:bg-transparent" : "md:rounded-none md:px-4 md:py-3 md:hover:bg-transparent",
                  // El subrayado visual en desktop lo maneja el indicador; mantenemos color del activo
                  isActive && "md:bg-transparent md:text-primary-700",
                  !isActive && "md:text-slate-700 md:hover:text-slate-900",
                  variant === "justified" && "md:justify-center w-full"
                )}
              >
                {tab.icon && (
                  <span aria-hidden className={clsx("flex-shrink-0",
                    isActive ? "text-white" : "text-slate-500 md:text-inherit"
                  )}>
                    {tab.icon}
                  </span>
                )}
                <span className={clsx("truncate md:max-w-none", isSm ? "max-w-[8rem]" : "max-w-[10rem]")}>{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Tabs;
