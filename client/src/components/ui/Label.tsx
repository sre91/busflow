import type { ReactNode } from "react";

type LabelProps = {
  children: ReactNode;
  htmlFor?: string;
};

function Label({ children, htmlFor }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-semibold text-text"
    >
      {children}
    </label>
  );
}

export default Label;
