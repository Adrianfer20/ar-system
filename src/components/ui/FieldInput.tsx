// src/components/ui/FieldInput.tsx
const FieldInput = (params: { 
  name: string, 
  value: string, 
  setValue: (value: string) => void, 
  type: string, 
  label: string,
  disabled?: boolean,
}) => {
  const { value, setValue, type, label, name, disabled = false } = params;

  return (
    <div>
      <label htmlFor={name} className="relative">
        <input
          type={type}
          id={name}
          placeholder=""
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          className="h-12 peer mt-0.5 w-full rounded border border-slate-300 shadow px-2"
          autoComplete="off"
          disabled={disabled}
        />

        <span className="absolute inset-y-0 start-3 -translate-y-5 bg-slate-100 px-1 font-medium text-slate-700 transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-7">
          {label}
        </span>
      </label>
    </div>
  );
};

export default FieldInput;
