import { useEffect, useState } from "react";
import {
  ArrowRight,
  Armchair,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
  Wifi,
  Zap,
} from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useNavigate, useParams } from "react-router-dom";
import { getBusById, type Bus } from "../api/busApi";

function BusDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBus = async () => {
      if (!id) {
        setError("Bus ID is missing");
        setLoading(false);
        return;
      }

      try {
        const data = await getBusById(id);

        setBus(data);
      } catch (error) {
        console.error("Failed to fetch bus:", error);

        setError("Unable to load bus details");
      } finally {
        setLoading(false);
      }
    };

    fetchBus();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg font-medium text-primary-dark">
          Loading bus details... 🚌
        </p>
      </main>
    );
  }

  if (error || !bus) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-dark">
            Bus not found
          </h1>

          <p className="mt-2 text-muted">
            {error || "Unable to find this bus."}
          </p>

          <div className="mt-6">
            <Button onClick={() => navigate("/buses")}>Back to buses</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <Badge variant="primary">Bus details</Badge>

          <h1 className="mt-4 text-3xl font-bold text-primary-dark md:text-4xl">
            {bus.operator}
          </h1>

          <p className="mt-2 text-muted">
            {bus.busType} · {bus.source} → {bus.destination}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Journey */}
            <Card>
              <h2 className="text-xl font-bold text-primary-dark">
                Journey details
              </h2>

              <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div>
                  <p className="text-sm text-muted">Departure</p>

                  <p className="mt-1 text-2xl font-bold text-primary-dark">
                    {bus.departureTime}
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                    <MapPin size={16} />
                    {bus.source}
                  </p>
                </div>

                <div className="hidden md:block">
                  <ArrowRight className="text-primary" />
                </div>

                <div className="md:text-right">
                  <p className="text-sm text-muted">Arrival</p>

                  <p className="mt-1 text-2xl font-bold text-primary-dark">
                    {bus.arrivalTime}
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-muted md:justify-end">
                    <MapPin size={16} />
                    {bus.destination}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 border-t border-slate-100 pt-6 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <Clock3 size={16} />
                  {bus.duration}
                </span>

                <span className="flex items-center gap-2">
                  <Star size={16} className="fill-current text-amber-500" />
                  {bus.rating} rating
                </span>

                <span className="flex items-center gap-2">
                  <Armchair size={16} />
                  {bus.availableSeats} seats available
                </span>
              </div>
            </Card>

            {/* Amenities */}
            <Card>
              <h2 className="text-xl font-bold text-primary-dark">Amenities</h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-background p-4">
                  <Wifi className="text-primary" />
                  <span className="font-medium text-primary-dark">Wi-Fi</span>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-background p-4">
                  <Zap className="text-primary" />
                  <span className="font-medium text-primary-dark">
                    Charging point
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-background p-4">
                  <ShieldCheck className="text-primary" />
                  <span className="font-medium text-primary-dark">
                    Safety certified
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-background p-4">
                  <Armchair className="text-primary" />
                  <span className="font-medium text-primary-dark">
                    Comfortable sleeper
                  </span>
                </div>
              </div>
            </Card>

            {/* Boarding points */}
            <Card>
              <h2 className="text-xl font-bold text-primary-dark">
                Boarding points
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 h-3 w-3 rounded-full bg-primary" />

                  <div>
                    <p className="font-semibold text-primary-dark">
                      Koyambedu Bus Terminal
                    </p>

                    <p className="mt-1 text-sm text-muted">
                      Boarding at 10:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 h-3 w-3 rounded-full bg-primary" />

                  <div>
                    <p className="font-semibold text-primary-dark">Porur</p>

                    <p className="mt-1 text-sm text-muted">
                      Boarding at 10:20 PM
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Summary */}
          <Card className="h-fit lg:sticky lg:top-24">
            <p className="text-sm text-muted">Starting from</p>

            <p className="mt-1 text-3xl font-bold text-primary-dark">
              ₹{bus.price}
            </p>

            <div className="my-6 border-t border-slate-200" />

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Bus type</span>

                <span className="font-semibold text-primary-dark">
                  {bus.busType}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Seats available</span>

                <span className="font-semibold text-success">
                  {bus.availableSeats} seats
                </span>
              </div>
            </div>

            <div className="mt-7">
              <Button onClick={() => navigate(`/bus/${id}/seats`)}>
                <span className="flex items-center justify-center gap-2">
                  <Armchair size={18} />
                  Select Seats
                </span>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default BusDetailsPage;
