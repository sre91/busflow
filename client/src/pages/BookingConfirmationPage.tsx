import { useEffect } from "react";
import { CheckCircle2, Clock3, Download, MapPin, Ticket } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { useAppDispatch } from "../app/hooks";
import { clearBooking } from "../features/booking/bookingSlice";

import type { Booking } from "../api/bookingApi";

function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const booking = location.state?.booking as Booking | undefined;

  useEffect(() => {
    if (booking) {
      dispatch(clearBooking());
    }
  }, [booking, dispatch]);

  if (!booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Card className="text-center">
          <h2 className="text-xl font-bold text-primary-dark">
            Booking information unavailable
          </h2>

          <p className="mt-2 text-muted">
            We couldn't find the booking details for this page.
          </p>

          <div className="mt-6">
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </Card>
      </main>
    );
  }

  const convenienceFee = 49;

  const seatFare = booking.totalAmount - convenienceFee;

  const journeyDate = new Date(booking.journeyDate).toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

  const bookingCreatedDate = new Date(booking.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-3xl px-6 py-12">
        {/* Success Header */}

        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 size={42} />
          </div>

          <div className="mt-5">
            <Badge variant="success">Booking confirmed</Badge>
          </div>

          <h1 className="mt-5 text-3xl font-bold text-primary-dark md:text-4xl">
            Your trip is booked! 🎉
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-muted">
            Your booking has been confirmed. Keep your booking ID handy for your
            journey.
          </p>
        </div>

        <Card className="mt-10 overflow-hidden p-0">
          {/* Booking Header */}

          <div className="border-b border-slate-200 bg-primary-dark p-6 text-white">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Ticket size={24} />

                <div>
                  <p className="text-sm text-slate-300">Booking ID</p>

                  <p className="break-all font-bold">{booking._id}</p>
                </div>
              </div>

              <Badge variant="success">{booking.bookingStatus}</Badge>
            </div>
          </div>

          <div className="p-6">
            {/* Bus */}

            <div>
              <h2 className="text-xl font-bold text-primary-dark">
                {booking.busId.operator}
              </h2>

              <p className="mt-1 text-sm text-muted">{booking.busId.busType}</p>
            </div>

            {/* Journey Date */}

            <div className="mt-6 rounded-2xl bg-primary/5 p-5">
              <p className="text-sm font-medium text-muted">Journey date</p>

              <p className="mt-1 text-xl font-bold text-primary-dark">
                {journeyDate}
              </p>
            </div>

            {/* Route */}

            <div className="mt-7 grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div>
                <p className="text-sm text-muted">Departure</p>

                <p className="mt-1 text-2xl font-bold text-primary-dark">
                  {booking.busId.departureTime || "--"}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <MapPin size={16} />

                  {booking.busId.source}
                </p>
              </div>

              <div className="hidden sm:block">
                <Clock3 className="text-primary" />
              </div>

              <div className="sm:text-right">
                <p className="text-sm text-muted">Arrival</p>

                <p className="mt-1 text-2xl font-bold text-primary-dark">
                  {booking.busId.arrivalTime || "--"}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-muted sm:justify-end">
                  <MapPin size={16} />

                  {booking.busId.destination}
                </p>
              </div>
            </div>

            {/* Booking Details */}

            <div className="mt-8 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted">Journey date</p>

                <p className="mt-1 font-semibold text-primary-dark">
                  {journeyDate}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Seats</p>

                <p className="mt-1 font-semibold text-primary-dark">
                  {booking.seats.join(", ")}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Passenger</p>

                <p className="mt-1 font-semibold text-primary-dark">
                  {booking.passenger.name}
                </p>
              </div>
            </div>

            {/* Passenger Details */}

            <div className="mt-6 rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-primary-dark">Passenger details</h3>

              <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-muted">Name</p>

                  <p className="mt-1 font-semibold text-primary-dark">
                    {booking.passenger.name}
                  </p>
                </div>

                <div>
                  <p className="text-muted">Age</p>

                  <p className="mt-1 font-semibold text-primary-dark">
                    {booking.passenger.age}
                  </p>
                </div>

                <div>
                  <p className="text-muted">Phone</p>

                  <p className="mt-1 font-semibold text-primary-dark">
                    {booking.passenger.phone}
                  </p>
                </div>

                <div>
                  <p className="text-muted">Email</p>

                  <p className="mt-1 break-all font-semibold text-primary-dark">
                    {booking.passenger.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}

            <div className="mt-8 rounded-2xl bg-background p-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Seat fare</span>

                <span className="font-semibold text-primary-dark">
                  ₹{seatFare}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-muted">Convenience fee</span>

                <span className="font-semibold text-primary-dark">
                  ₹{convenienceFee}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-muted">Payment method</span>

                <span className="font-semibold uppercase text-primary-dark">
                  {booking.paymentMethod}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-muted">Payment status</span>

                <span className="font-semibold capitalize text-success">
                  {booking.paymentStatus}
                </span>
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold text-primary-dark">
                    Total paid
                  </span>

                  <span className="text-xl font-bold text-primary">
                    ₹{booking.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Created */}

            <div className="mt-5 text-center text-xs text-muted">
              Booking created on {bookingCreatedDate}
            </div>

            {/* Download Ticket */}

            <div className="mt-7">
              <Button onClick={() => window.print()}>
                <span className="flex items-center justify-center gap-2">
                  <Download size={18} />
                  Download Ticket
                </span>
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center text-sm text-muted">
          Your booking has been successfully created in BusFlow.
        </div>
      </section>
    </main>
  );
}

export default BookingConfirmationPage;
