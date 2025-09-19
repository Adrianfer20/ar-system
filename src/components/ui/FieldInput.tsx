// src/components/ui/FieldInput.tsx
import React from "react";

type FieldInputProps = {
  name: string;
  value: string;
  setValue: (value: string) => void;
  type: string;
  label: string;
  disabled?: boolean;
  rightAdornment?: React.ReactNode; // Slot para botón/ícono a la derecha
};

const FieldInput: React.FC<FieldInputProps> = (params) => {
  const { value, setValue, type, label, name, disabled = false, rightAdornment } = params;

  return (
    <div>
      <label htmlFor={name} className="relative block">
        <input
          type={type}
          id={name}
          placeholder=""
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          className={`h-12 peer mt-0.5 w-full rounded bg-white border border-slate-300 shadow px-3 ${rightAdornment ? "pr-10" : ""}`}
          autoComplete="off"
          disabled={disabled}
        />

        <span
          className="pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 font-medium text-slate-700 text-xs transition-all
                     peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-slate-500 peer-placeholder-shown:text-base
                     peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs"
        >
          {label}
        </span>

        {rightAdornment && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightAdornment}
          </div>
        )}
      </label>
    </div>
  );
};

export default FieldInput;
