import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Ticket,
} from "lucide-react";
import { Link } from "react-router-dom";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { getMyBookings, type Booking } from "../api/bookingApi";

function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getMyBookings();

        setBookings(data);
      } catch (error) {
        console.error("Failed to load bookings:", error);

        setErrorMessage("Unable to load your bookings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto max-w-7xl px-6 py-10">
          <Badge variant="primary">My bookings</Badge>

          <h1 className="mt-4 text-3xl font-bold text-primary-dark md:text-4xl">
            Your trips
          </h1>

          <div className="mt-8 grid gap-5">
            {[1, 2, 3].map((item) => (
              <Card key={item}>
                <div className="animate-pulse space-y-4">
                  <div className="h-6 w-48 rounded bg-slate-200" />
                  <div className="h-4 w-72 rounded bg-slate-200" />
                  <div className="h-16 rounded bg-slate-200" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto max-w-7xl px-6 py-10">
          <Card className="text-center">
            <h2 className="text-xl font-bold text-primary-dark">
              Something went wrong
            </h2>

            <p className="mt-2 text-muted">{errorMessage}</p>

            <div className="mt-6">
              <Button onClick={() => window.location.reload()}>
                Try again
              </Button>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <Badge variant="primary">My bookings</Badge>

          <h1 className="mt-4 text-3xl font-bold text-primary-dark md:text-4xl">
            Your trips
          </h1>

          <p className="mt-2 text-muted">
            View and manage your BusFlow bookings.
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card className="mt-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Ticket size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-primary-dark">
              No bookings yet
            </h2>

            <p className="mt-2 text-muted">
              Your upcoming trips will appear here.
            </p>

            <div className="mt-6">
              <Link to="/search">
                <Button>Find a bus</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="mt-8 grid gap-5">
            {bookings.map((booking) => {
              const journeyDate = new Date(
                booking.journeyDate,
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              const bookingDate = new Date(
                booking.createdAt,
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              return (
                <Card key={booking._id}>
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-primary-dark">
                          {booking.busId.operator}
                        </h2>

                        <Badge
                          variant={
                            booking.bookingStatus === "confirmed"
                              ? "success"
                              : "primary"
                          }
                        >
                          {booking.bookingStatus}
                        </Badge>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
                        <span className="flex items-center gap-2">
                          <MapPin size={16} />
                          {booking.busId.source} → {booking.busId.destination}
                        </span>

                        <span className="flex items-center gap-2">
                          <CalendarDays size={16} />
                          Journey: {journeyDate}
                        </span>

                        <span className="flex items-center gap-2">
                          <Clock3 size={16} />

                          {booking.busId.departureTime || "Departure time"}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-6 border-t border-slate-200 pt-5 text-sm">
                        <div>
                          <p className="text-muted">Booking ID</p>

                          <p className="mt-1 font-semibold text-primary-dark">
                            {booking._id}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted">Seats</p>

                          <p className="mt-1 font-semibold text-primary-dark">
                            {booking.seats.join(", ")}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted">Passenger</p>

                          <p className="mt-1 font-semibold text-primary-dark">
                            {booking.passenger.name}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted">Booking date</p>

                          <p className="mt-1 font-semibold text-primary-dark">
                            {bookingDate}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted">Total paid</p>

                          <p className="mt-1 font-semibold text-primary">
                            ₹{booking.totalAmount}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link to={`/booking/${booking._id}`} className="shrink-0">
                      <Button>
                        <span className="flex items-center justify-center gap-2">
                          View details
                          <ChevronRight size={18} />
                        </span>
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default MyBookingsPage;
