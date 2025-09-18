import React from "react";
import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ className, children, hover = false, ...rest }) => {
  return (
    <div
      className={clsx(
        "bg-white border border-slate-200 rounded shadow-sm overflow-hidden",
        hover && "transition-all hover:shadow-md",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={clsx("p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70", className)} {...rest} />
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={clsx("p-5 sm:p-6", className)} {...rest} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={clsx("px-5 py-3 border-t border-slate-200 bg-slate-50", className)} {...rest} />
);

export default Card;
