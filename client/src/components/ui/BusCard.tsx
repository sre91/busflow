import { Clock3, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Badge from "./Badge";
import Button from "./Button";
import Card from "./Card";

type BusCardProps = {
  id: number;
  operator: string;
  busType: string;
  departure: string;
  arrival: string;
  route: string;
  rating: number;
  seatsAvailable: number;
  price: number;
};

function BusCard({
  id,
  operator,
  busType,
  departure,
  arrival,
  route,
  rating,
  seatsAvailable,
  price,
}: BusCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-primary-dark">{operator}</h2>

            <Badge variant="primary">{busType}</Badge>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Clock3 size={16} />
              {departure} → {arrival}
            </span>

            <span className="flex items-center gap-1.5">
              <MapPin size={16} />
              {route}
            </span>

            <span className="flex items-center gap-1.5">
              <Star size={16} className="fill-current text-amber-500" />
              {rating}
            </span>
          </div>

          <p className="mt-4 text-sm text-muted">
            {seatsAvailable} seats available
          </p>
        </div>

        <div className="flex items-center justify-between gap-6 md:block md:text-right">
          <div>
            <p className="text-sm text-muted">Starting from</p>

            <p className="mt-1 text-2xl font-bold text-primary">₹{price}</p>
          </div>

          <div className="mt-3">
            <Button onClick={() => navigate(`/bus/${id}`)}>View Seats</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default BusCard;
