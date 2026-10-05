import { useEffect, useState } from "react";
import {
  Armchair,
  ArrowRight,
  BusFront,
  CheckCircle2,
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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getBusById, type Bus } from "../api/busApi";
import socket from "../socket";

type SeatUpdateData = {
  event: "booking" | "cancellation";
  busId: string;
  bookedSeats: string[];
  releasedSeats: string[];
  availableSeats: number;
};

function BusDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [searchParams] = useSearchParams();

  const journeyDate = searchParams.get("journeyDate") || "";

  const [bus, setBus] = useState<Bus | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [seatUpdateMessage, setSeatUpdateMessage] = useState("");

  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);

  // Fetch bus details

  useEffect(() => {
    const loadBus = async () => {
      if (!id) {
        setError("Bus ID is missing");
        setLoading(false);
        return;
      }

      try {
        const data = await getBusById(id);

        setBus(data);
        setError("");
      } catch (error) {
        console.error("Failed to fetch bus:", error);

        setError("Unable to load bus details");
      } finally {
        setLoading(false);
      }
    };

    loadBus();
  }, [id]);

  // Socket connection status

  useEffect(() => {
    const handleConnect = () => {
      setIsSocketConnected(true);
    };

    const handleDisconnect = () => {
      setIsSocketConnected(false);
    };

    socket.on("connect", handleConnect);

    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);

      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  // Bus room and real-time seat updates

  useEffect(() => {
    if (!id) {
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const joinRoom = async () => {
      socket.emit("joinBusRoom", id);

      console.log(`🚌 Joined bus room: bus:${id}`);

      try {
        const latestBus = await getBusById(id);

        setBus(latestBus);

        console.log("🔄 Bus details refreshed after socket connection");
      } catch (error) {
        console.error(
          "❌ Failed to refresh bus after socket connection:",
          error,
        );
      }
    };

    const handleSeatUpdate = (data: SeatUpdateData) => {
      console.log("💺 Real-time seat update:", data);

      if (data.busId !== id) {
        return;
      }

      if (data.event !== "booking" && data.event !== "cancellation") {
        console.error("❌ Invalid seat update event:", data);

        return;
      }

      if (typeof data.availableSeats !== "number" || data.availableSeats < 0) {
        console.error("❌ Invalid seat availability received:", data);

        return;
      }

      if (!Array.isArray(data.bookedSeats)) {
        console.error("❌ Invalid booked seats received:", data);

        return;
      }

      if (!Array.isArray(data.releasedSeats)) {
        console.error("❌ Invalid released seats received:", data);

        return;
      }

      setBus((currentBus) => {
        if (!currentBus) {
          return currentBus;
        }

        const safeAvailableSeats = Math.min(
          data.availableSeats,
          currentBus.totalSeats,
        );

        if (currentBus.availableSeats === safeAvailableSeats) {
          return currentBus;
        }

        setSeatUpdateMessage("Seat availability updated");

        return {
          ...currentBus,
          availableSeats: safeAvailableSeats,
        };
      });

      setTimeout(() => {
        setSeatUpdateMessage("");
      }, 3000);
    };

    socket.on("connect", joinRoom);

    socket.on("seatUpdate", handleSeatUpdate);

    if (socket.connected) {
      joinRoom();
    }

    return () => {
      socket.emit("leaveBusRoom", id);

      socket.off("connect", joinRoom);

      socket.off("seatUpdate", handleSeatUpdate);

      console.log(`🧹 Cleaned up bus room listener: bus:${id}`);
    };
  }, [id]);

  // Loading state

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="animate-pulse">
            <div className="h-5 w-28 rounded-lg bg-slate-200" />

            <div className="mt-5 h-10 w-80 max-w-full rounded-lg bg-slate-200" />

            <div className="mt-3 h-5 w-96 max-w-full rounded-lg bg-slate-200" />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              {/* Journey skeleton */}

              <Card className="h-64">
                <div className="h-full animate-pulse">
                  <div className="h-6 w-40 rounded bg-slate-200" />

                  <div className="mt-6 h-10 w-full rounded bg-slate-200" />

                  <div className="mt-5 h-5 w-64 rounded bg-slate-200" />
                </div>
              </Card>

              {/* Amenities skeleton */}

              <Card className="h-52">
                <div className="animate-pulse">
                  <div className="h-6 w-32 rounded bg-slate-200" />

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="h-14 rounded-xl bg-slate-200" />
                    <div className="h-14 rounded-xl bg-slate-200" />
                    <div className="h-14 rounded-xl bg-slate-200" />
                    <div className="h-14 rounded-xl bg-slate-200" />
                  </div>
                </div>
              </Card>

              {/* Boarding points skeleton */}

              <Card className="h-40">
                <div className="animate-pulse">
                  <div className="h-6 w-40 rounded bg-slate-200" />

                  <div className="mt-6 space-y-4">
                    <div className="h-4 w-64 rounded bg-slate-200" />
                    <div className="h-4 w-48 rounded bg-slate-200" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Booking summary skeleton */}

            <Card className="h-80">
              <div className="animate-pulse">
                <div className="h-4 w-24 rounded bg-slate-200" />

                <div className="mt-3 h-9 w-32 rounded bg-slate-200" />

                <div className="my-6 border-t border-slate-200" />

                <div className="space-y-5">
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-full rounded bg-slate-200" />
                </div>

                <div className="mt-7 h-12 w-full rounded-xl bg-slate-200" />
              </div>
            </Card>
          </div>
        </section>
      </main>
    );
  }

  // Error state

  if (error || !bus) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 py-10">
          <Card className="w-full max-w-md border border-slate-200 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <BusFront size={25} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-primary-dark">
              Bus not found
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              {error || "Unable to find this bus."}
            </p>

            <div className="mt-6">
              <Button onClick={() => navigate("/search")}>Back to buses</Button>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  const formattedJourneyDate = journeyDate
    ? new Date(`${journeyDate}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        {/* Header */}

        <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <Badge variant="primary">
                <span className="flex items-center gap-1.5">
                  <BusFront size={14} />
                  Bus details
                </span>
              </Badge>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-dark md:text-4xl">
                {bus.operator}
              </h1>

              <p className="mt-2 text-muted">
                {bus.busType}
                <span className="mx-2 text-slate-300">•</span>
                {bus.source}
                <span className="mx-2 text-primary">→</span>
                {bus.destination}
              </p>

              {journeyDate && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary/5 px-3.5 py-2 text-sm font-medium text-primary">
                  <Clock3 size={16} />
                  Travel date: {formattedJourneyDate}
                </div>
              )}
            </div>

            {/* Live status */}

            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium ${
                isSocketConnected
                  ? "bg-success/10 text-success"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isSocketConnected ? "bg-success" : "bg-red-500"
                }`}
              />

              {isSocketConnected ? "Live updates" : "Live updates unavailable"}
            </div>
          </div>
        </div>

        {/* Main content */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Journey */}

            <Card className="border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin size={19} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-primary-dark">
                    Journey details
                  </h2>

                  <p className="text-sm text-muted">
                    Your departure and arrival information
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
                {/* Departure */}

                <div>
                  <p className="text-sm font-medium text-muted">Departure</p>

                  <p className="mt-1 text-3xl font-bold text-primary-dark">
                    {bus.departureTime}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                    <MapPin size={16} className="text-primary" />

                    {bus.source}
                  </div>
                </div>

                {/* Route */}

                <div className="hidden md:flex md:flex-col md:items-center md:gap-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted">
                    <span className="h-2 w-2 rounded-full bg-primary" />

                    <span className="h-px w-14 bg-slate-200" />

                    <ArrowRight size={17} className="text-primary" />

                    <span className="h-px w-14 bg-slate-200" />

                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </div>

                  <span className="text-xs text-muted">{bus.duration}</span>
                </div>

                {/* Arrival */}

                <div className="md:text-right">
                  <p className="text-sm font-medium text-muted">Arrival</p>

                  <p className="mt-1 text-3xl font-bold text-primary-dark">
                    {bus.arrivalTime}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm text-muted md:justify-end">
                    <MapPin size={16} className="text-primary" />

                    {bus.destination}
                  </div>
                </div>
              </div>

              {/* Journey stats */}

              <div className="mt-8 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-3">
                <div className="rounded-xl bg-background p-4">
                  <div className="flex items-center gap-2 text-muted">
                    <Clock3 size={16} />

                    <span className="text-sm">Duration</span>
                  </div>

                  <p className="mt-2 font-semibold text-primary-dark">
                    {bus.duration}
                  </p>
                </div>

                <div className="rounded-xl bg-background p-4">
                  <div className="flex items-center gap-2 text-muted">
                    <Star size={16} className="fill-current text-amber-500" />

                    <span className="text-sm">Rating</span>
                  </div>

                  <p className="mt-2 font-semibold text-primary-dark">
                    {bus.rating} / 5
                  </p>
                </div>

                <div className="rounded-xl bg-background p-4">
                  <div className="flex items-center gap-2 text-muted">
                    <Armchair size={16} />

                    <span className="text-sm">Availability</span>
                  </div>

                  <p className="mt-2 font-semibold text-success">
                    {bus.availableSeats} seats
                  </p>
                </div>
              </div>
            </Card>

            {/* Amenities */}

            <Card className="border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-primary-dark">Amenities</h2>

              <p className="mt-1 text-sm text-muted">
                Comfort and convenience for your journey
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Wifi size={19} />
                  </div>

                  <span className="font-medium text-primary-dark">Wi-Fi</span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Zap size={19} />
                  </div>

                  <span className="font-medium text-primary-dark">
                    Charging point
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck size={19} />
                  </div>

                  <span className="font-medium text-primary-dark">
                    Safety certified
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Armchair size={19} />
                  </div>

                  <span className="font-medium text-primary-dark">
                    Comfortable sleeper
                  </span>
                </div>
              </div>
            </Card>

            {/* Boarding points */}

            <Card className="border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-primary" />

                <h2 className="text-xl font-bold text-primary-dark">
                  Boarding points
                </h2>
              </div>

              <div className="relative mt-7 space-y-6 pl-2">
                {/* Connecting line */}

                <div className="absolute bottom-5 left-[7px] top-2 w-px bg-slate-200" />

                <div className="relative flex items-start gap-4">
                  <div className="z-10 mt-1 h-3.5 w-3.5 rounded-full border-2 border-surface bg-primary ring-2 ring-primary/20" />

                  <div>
                    <p className="font-semibold text-primary-dark">
                      Koyambedu Bus Terminal
                    </p>

                    <p className="mt-1 text-sm text-muted">
                      Boarding at 10:00 PM
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="z-10 mt-1 h-3.5 w-3.5 rounded-full border-2 border-surface bg-primary ring-2 ring-primary/20" />

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

          <Card className="h-fit border border-slate-200 shadow-sm lg:sticky lg:top-24">
            {seatUpdateMessage && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary">
                <CheckCircle2 size={17} />
                {seatUpdateMessage}
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted">Starting from</p>

              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary-dark">
                  ₹{bus.price}
                </span>

                <span className="text-sm text-muted">/ seat</span>
              </div>
            </div>

            <div className="my-6 border-t border-slate-200" />

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted">Bus type</span>

                <span className="text-right text-sm font-semibold text-primary-dark">
                  {bus.busType}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted">Seats available</span>

                <span className="text-sm font-semibold text-success">
                  {bus.availableSeats} seats
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted">Travel date</span>

                <span className="text-right text-sm font-semibold text-primary-dark">
                  {journeyDate
                    ? new Date(`${journeyDate}T00:00:00`).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )
                    : "Missing"}
                </span>
              </div>
            </div>

            <div className="mt-7">
              <Button
                disabled={!journeyDate || bus.availableSeats === 0}
                onClick={() =>
                  navigate(
                    `/bus/${id}/seats?journeyDate=${encodeURIComponent(
                      journeyDate,
                    )}`,
                  )
                }
              >
                <span className="flex items-center justify-center gap-2">
                  <Armchair size={18} />

                  {bus.availableSeats === 0 ? "Sold Out" : "Select Seats"}

                  {bus.availableSeats > 0 && <ArrowRight size={17} />}
                </span>
              </Button>
            </div>

            <p className="mt-4 text-center text-xs leading-relaxed text-muted">
              Seat availability is updated in real time.
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default BusDetailsPage;
