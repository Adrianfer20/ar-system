import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

export type LogoProps = {
  to?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  tone?: "light" | "dark"; // para colores sobre fondos oscuros o claros
  asLink?: boolean; // si true, envuelve en <Link>
};

/**
 * Logo de la app: A|R System con branding consistente.
 * - size: controla tipografía
 * - tone: ajusta colores para fondo claro u oscuro
 * - asLink: si true, se renderiza como <Link to={to || "/"}>
 */
const Logo: React.FC<LogoProps> = ({ to = "/", className, size = "md", tone = "light", asLink = true }) => {
  const sizeCls = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }[size];

  const colorCls = tone === "light" ? "text-white" : "text-slate-900";
  const accentCls = tone === "light" ? "text-yellow-500" : "text-amber-600";

  const content = (
    <span className={clsx("font-extrabold uppercase select-none", sizeCls, colorCls, className)}>
      A<span className={accentCls}>|</span>R System
    </span>
  );

  if (asLink) {
    return (
      <Link to={to} aria-label="Ir al inicio" className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
