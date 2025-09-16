import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "outline" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
  outline:
    "border border-primary-600 text-primary-700 hover:bg-primary-600 hover:text-white focus:ring-primary-500",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  className,
  fullWidth = false,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={clsx(baseClasses, variants[variant], fullWidth && "w-full", className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
};

export const IconButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { ariaLabel: string }
> = ({ ariaLabel, className, type = "button", children, ...props }) => (
  <button
    type={type}
    aria-label={ariaLabel}
    className={clsx(
      "inline-flex items-center justify-center rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;