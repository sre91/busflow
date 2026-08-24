import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

function Button({ children, onClick, disabled = false }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        rounded-xl
        bg-primary
        px-6
        py-3
        font-semibold
        text-white
        transition
        hover:bg-primary-dark
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {children}
    </button>
  );
}

export default Button;
