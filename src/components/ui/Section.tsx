import React from "react";
import Card, { CardBody } from "./Card";
import clsx from "clsx";

type PageSectionProps = React.HTMLAttributes<HTMLDivElement> & {
  noCard?: boolean;
  bodyClassName?: string;
  hover?: boolean;
};

export const PageSection: React.FC<PageSectionProps> = ({ children, className, bodyClassName, noCard, hover }) => {
  if (noCard) {
    return <div className={clsx("mb-6", className)}>{children}</div>;
  }
  return (
    <Card className={clsx("mb-6", className)} hover={hover}
    >
      <CardBody className={bodyClassName}>{children}</CardBody>
    </Card>
  );
};

type PageSectionHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  actions?: React.ReactNode;
};

export const PageSectionHeader: React.FC<PageSectionHeaderProps> = ({ title, actions, className, children, ...rest }) => (
  <div className={clsx("flex items-end justify-between mb-4", className)} {...rest}>
    <div>
      {title && <h3 className="text-base sm:text-lg font-semibold text-slate-800">{title}</h3>}
      {children}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export default PageSection;
