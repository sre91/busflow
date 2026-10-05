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
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12">
          <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm md:p-7">
            <Badge variant="primary">My bookings</Badge>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-dark md:text-4xl">
              Your trips
            </h1>

            <p className="mt-2 text-sm text-muted md:text-base">
              Loading your BusFlow bookings...
            </p>
          </div>

          <div className="mt-8 grid gap-5">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="border border-slate-200 shadow-sm">
                <div className="animate-pulse space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="h-6 w-48 rounded-lg bg-slate-200" />
                    <div className="h-7 w-24 rounded-full bg-slate-200" />
                  </div>

                  <div className="h-4 w-full max-w-xl rounded bg-slate-200" />

                  <div className="grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-4">
                    <div className="h-12 rounded-lg bg-slate-200" />
                    <div className="h-12 rounded-lg bg-slate-200" />
                    <div className="h-12 rounded-lg bg-slate-200" />
                    <div className="h-12 rounded-lg bg-slate-200" />
                  </div>
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
        <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
          <Card className="w-full max-w-md border border-slate-200 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Ticket size={25} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-primary-dark">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              {errorMessage}
            </p>

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
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12">
        {/* Page header */}

        <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm md:p-7">
          <Badge variant="primary">
            <span className="flex items-center gap-1.5">
              <Ticket size={14} />
              My bookings
            </span>
          </Badge>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary-dark md:text-4xl">
                Your trips
              </h1>

              <p className="mt-2 text-sm leading-relaxed text-muted md:text-base">
                View and manage your BusFlow bookings in one place.
              </p>
            </div>

            {bookings.length > 0 && (
              <div className="rounded-xl bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                {bookings.length}{" "}
                {bookings.length === 1 ? "booking" : "bookings"}
              </div>
            )}
          </div>
        </div>

        {/* Empty state */}

        {bookings.length === 0 ? (
          <Card className="mt-8 border border-slate-200 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Ticket size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-primary-dark">
              No bookings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              You haven't booked a bus yet. Find your next journey and your
              booking will appear here.
            </p>

            <div className="mt-6">
              <Link to="/search">
                <Button>Find a bus</Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* Booking list */

          <div className="mt-8 grid gap-5">
            {bookings.map((booking) => {
              const formattedJourneyDate = new Date(
                `${booking.journeyDate}T00:00:00`,
              ).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              const isConfirmed = booking.bookingStatus === "confirmed";

              const bus = booking.busId;

              return (
                <Card
                  key={booking._id}
                  className="border border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Booking top section */}

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-primary-dark md:text-2xl">
                          {bus?.operator || "Bus information unavailable"}
                        </h2>

                        <Badge variant={isConfirmed ? "success" : "primary"}>
                          {booking.bookingStatus}
                        </Badge>
                      </div>

                      <p className="mt-1 text-sm text-muted">
                        {bus?.busType || "Bus type unavailable"}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-xl bg-primary/5 px-4 py-2 text-right">
                      <p className="text-xs text-muted">Total paid</p>

                      <p className="mt-0.5 text-lg font-bold text-primary">
                        ₹{booking.totalAmount}
                      </p>
                    </div>
                  </div>

                  {/* Journey information */}

                  <div className="mt-6 rounded-2xl bg-background p-5">
                    {bus ? (
                      <div className="grid gap-5 md:grid-cols-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <MapPin size={17} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs text-muted">Route</p>

                            <p className="mt-1 font-semibold text-primary-dark">
                              {bus.source}
                              <span className="mx-1 text-primary">→</span>
                              {bus.destination}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <CalendarDays size={17} />
                          </div>

                          <div>
                            <p className="text-xs text-muted">Journey date</p>

                            <p className="mt-1 font-semibold text-primary-dark">
                              {formattedJourneyDate}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Clock3 size={17} />
                          </div>

                          <div>
                            <p className="text-xs text-muted">Departure</p>

                            <p className="mt-1 font-semibold text-primary-dark">
                              {bus.departureTime || "Not available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-muted">
                          <Ticket size={17} />
                        </div>

                        <div>
                          <p className="font-semibold text-primary-dark">
                            Bus information unavailable
                          </p>

                          <p className="mt-1 text-sm text-muted">
                            The bus associated with this booking is no longer
                            available.
                          </p>

                          <p className="mt-1 text-sm text-muted">
                            Journey date: {formattedJourneyDate}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Booking details */}

                  <div className="mt-6 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted">
                        Booking ID
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-primary-dark">
                        {booking._id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted">
                        Seats
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {booking.seats.map((seat) => (
                          <Badge key={seat}>{seat}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted">
                        Passenger
                      </p>

                      <p className="mt-1 text-sm font-semibold text-primary-dark">
                        {booking.passenger.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted">
                        Payment
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-semibold uppercase text-primary-dark">
                          {booking.paymentMethod}
                        </span>

                        <span className="text-xs text-success">
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}

                  <div className="mt-6 flex justify-end border-t border-slate-200 pt-5">
                    <Link
                      to={`/booking/${booking._id}`}
                      className="w-full sm:w-auto"
                    >
                      <Button className="w-full sm:w-auto">
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
