// src/components/ui/SelectInput.tsx
import React from "react";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  options,
  required = true,
  disabled = false,
  placeholder = "Selecciona una opción",
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300
                   focus:outline-none focus:ring-primary-500 focus:border-primary-500
                   sm:text-sm rounded-md capitalize"
        disabled={disabled}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
