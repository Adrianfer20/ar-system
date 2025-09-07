import React from "react";

type Option = {
  value: string;
  label: string;
};

interface FieldOptionProps {
  value: string;
  setValue: (value: string) => void;
  label: string;
  options: Option[];
  required?: boolean;
}

const FieldOption: React.FC<FieldOptionProps> = ({
  value,
  setValue,
  label,
  options,
  required = false,
}) => {
  return (
    <div className="flex justify-between items-center text-gray-700 rounded border border-gray-400 shadow focus-within:border-2 focus-within:border-gray-700">
      <span className="uppercase font-bold px-2">{label}:</span>
      <label className="relative block w-full">
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required={required}
          className="h-12 w-full border-none bg-transparent focus-within:border-none focus-visible:outline-none"
        >
          {/* Opción fantasma para el efecto de label flotante */}
          <option value="" disabled hidden></option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        
      </label>
    </div>
  );
};

export default FieldOption;
