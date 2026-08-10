import type { ChangeEventHandler } from "react";

type InputProps = {
  id: string;
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: "text" | "email";
  required?: boolean;
};

export function Input({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: InputProps) {
  return (
    <label className="form-field" htmlFor={id}>
      <span className="form-field__label">{label}</span>
      <input
        className="input"
        id={id}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}
