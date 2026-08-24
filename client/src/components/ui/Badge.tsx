import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "primary" | "success" | "error" | "neutral";
};

function Badge({ children, variant = "primary" }: BadgeProps) {
  const variants = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    error: "bg-error/10 text-error",
    neutral: "bg-slate-100 text-muted",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;
