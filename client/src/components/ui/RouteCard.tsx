import { ArrowRight, MapPin } from "lucide-react";

type RouteCardProps = {
  from: string;
  to: string;
  price: number;
};

function RouteCard({ from, to, price }: RouteCardProps) {
  return (
    <div className="group rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-2 text-sm text-muted">
        <MapPin size={16} />

        <span>Popular route</span>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div>
          <p className="font-semibold text-primary-dark">{from}</p>
        </div>

        <ArrowRight
          size={18}
          className="text-primary transition group-hover:translate-x-1"
        />

        <div>
          <p className="font-semibold text-primary-dark">{to}</p>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-sm text-muted">Starting from</p>

        <p className="mt-1 text-lg font-bold text-primary">₹{price}</p>
      </div>
    </div>
  );
}

export default RouteCard;
