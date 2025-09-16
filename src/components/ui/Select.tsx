import React from "react";

export type SelectOption = {
  label: string;
  value: string;
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  value: string;
  onChangeValue: (val: string) => void;
  placeholder?: string;
  withLeftIcon?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChangeValue,
  placeholder,
  className,
  withLeftIcon = false,
  ...rest
}) => {
  const base =
    "mt-1 block w-full text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md capitalize";
  const padding = withLeftIcon ? "pl-10 pr-4 py-2" : "pl-3 pr-10 py-2";
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        className={[base, padding, className].filter(Boolean).join(" ")}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
