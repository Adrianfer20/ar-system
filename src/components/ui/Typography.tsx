import React from "react";
import clsx from "clsx";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

export const H1: React.FC<HeadingProps> = ({ className, ...rest }) => (
  <h1 className={clsx("text-2xl sm:text-3xl font-bold text-gray-900", className)} {...rest} />
);

export const H2: React.FC<HeadingProps> = ({ className, ...rest }) => (
  <h2 className={clsx("text-xl sm:text-2xl font-semibold text-gray-900", className)} {...rest} />
);

export const H3: React.FC<HeadingProps> = ({ className, ...rest }) => (
  <h3 className={clsx("text-base sm:text-lg font-semibold text-gray-800", className)} {...rest} />
);

type PProps = React.HTMLAttributes<HTMLParagraphElement> & {
  variant?: "default" | "muted" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "xs";
};

export const P: React.FC<PProps> = ({ className, variant = "default", size = "md", ...rest }) => (
  <p
    className={clsx(
      "leading-relaxed",
      {
        default: "text-gray-600",
        muted: "text-slate-500",
        danger: "text-red-600",
        success: "text-emerald-600",
        warning: "text-amber-600",
      }[variant],
      {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
      }[size],
      className
    )}
    {...rest}
  />
);

export default { H1, H2, H3, P };
