import type { ChangeEventHandler } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
  required?: boolean;
};

export function Select({
  id,
  label,
  value,
  options,
  onChange,
  required = false,
}: SelectProps) {
  return (
    <label className="form-field" htmlFor={id}>
      <span className="form-field__label">{label}</span>
      <select
        className="select"
        id={id}
        onChange={onChange}
        required={required}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
