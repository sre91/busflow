import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        bg-surface
        p-6
        shadow-sm
        ring-1
        ring-slate-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;
