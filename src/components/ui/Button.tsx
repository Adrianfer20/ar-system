import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const baseClasses =
  "w-full block items-center gap-2 rounded-sm px-8 py-3 font-bold cursor-pointer focus:ring-3 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed transition";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border border-indigo-600 bg-indigo-600 text-white hover:bg-transparent hover:text-indigo-600",
  outline:
    "border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(baseClasses, variants[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
};
export default Button;