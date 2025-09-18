import React from "react";

type PageProps = {
  children: React.ReactNode;
  /** Ajustes adicionales de clase, ej. grid layouts internos */
  className?: string;
};

/**
 * Contenedor de página: aplica paddings y ancho máximo consistentes.
 */
export const Page: React.FC<PageProps> = ({ children, className }) => (
  <div className={`px-4 sm:px-6 lg:px-8 py-6 min-w-0 ${className ?? ""}`}>{children}</div>
);

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** Área opcional a la derecha (botones, filtros rápidos) */
  actions?: React.ReactNode;
  className?: string;
};

/**
 * Encabezado de página con título, subtítulo y slot de acciones.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, className }) => (
  <header className={`mb-6 ${className ?? ""}`}>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  </header>
);

export default Page;
