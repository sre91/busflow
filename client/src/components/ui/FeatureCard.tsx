import type { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-primary-dark">{title}</h3>

      <p className="mt-3 leading-7 text-muted">{description}</p>
    </div>
  );
}

export default FeatureCard;
