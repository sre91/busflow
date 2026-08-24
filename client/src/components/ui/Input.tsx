import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`
        w-full
        rounded-xl
        border
        border-slate-200
        bg-surface
        px-4
        py-3
        text-text
        outline-none
        transition
        placeholder:text-muted
        focus:border-primary
        focus:ring-2
        focus:ring-primary/20
        ${className}
      `}
    />
  );
}

export default Input;
