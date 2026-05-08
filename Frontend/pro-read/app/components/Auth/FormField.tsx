"use client";

import { Eye } from "lucide-react";
import { useState } from "react";

type FormFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  rightElement?: React.ReactNode;
  name?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  autoComplete?: string;
};

export default function FormField({
  label,
  type = "text",
  placeholder,
  rightElement,
  name,
  value,
  onChange,
  disabled,
  autoComplete,
}: FormFieldProps) {
  return (
    <div>
      <label 
      style={{ fontFamily: "Manrope, sans-serif" }}
      className="text-xs text-white/60">{label}</label>

      <div className="relative">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          className="w-full mt-1 bg-transparent border-b border-white/20 focus:border-purple-400 outline-none py-2 text-sm pr-8 transition placeholder:font-[Manrope]"
        />

        {rightElement && (
          <div className="absolute right-0 top-3 text-white/50 cursor-pointer">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

type PasswordFieldProps = Omit<
  FormFieldProps,
  "label" | "type" | "placeholder" | "rightElement"
>;

export function PasswordField({
  name = "password",
  value,
  onChange,
  disabled,
  autoComplete,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <FormField
      label="PASSWORD"
      name={name}
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoComplete={autoComplete}
      rightElement={
        <Eye size={16} onClick={() => setShow(!show)} />
      }
    />
  );
}
