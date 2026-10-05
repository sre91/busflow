import { useEffect } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Mail,
  MapPin,
  Phone,
  Ticket,
  UserRound,
} from "lucide-react";
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
      <main className="min-h-screen bg-background">
        <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 py-10">
          <Card className="w-full max-w-md border border-slate-200 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Ticket size={25} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-primary-dark">
              Booking information unavailable
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              We couldn't find the booking details for this page.
            </p>

            <div className="mt-6">
              <Button onClick={() => navigate("/")}>Back to Home</Button>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  const convenienceFee = 49;
  const seatFare = booking.totalAmount - convenienceFee;

  const journeyDate = new Date(
    `${booking.journeyDate}T00:00:00`,
  ).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

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
      <section className="mx-auto max-w-4xl px-6 py-10 md:py-12">
        {/* Success header */}

        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success shadow-sm">
            <CheckCircle2 size={42} />
          </div>

          <div className="mt-5">
            <Badge variant="success">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                Booking confirmed
              </span>
            </Badge>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-primary-dark md:text-4xl">
            Your trip is booked! 🎉
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted md:text-base">
            Your bus ticket has been successfully confirmed. Keep your booking
            ID handy for your journey.
          </p>
        </div>

        {/* Ticket */}

        <Card className="mt-10 overflow-hidden border border-slate-200 p-0 shadow-sm">
          {/* Ticket header */}

          <div className="bg-primary-dark p-6 text-white md:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Ticket size={23} />
                </div>

                <div>
                  <p className="text-sm text-slate-300">Booking ID</p>

                  <p className="mt-0.5 break-all font-bold">{booking._id}</p>
                </div>
              </div>

              <Badge variant="success">{booking.bookingStatus}</Badge>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Bus information */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-muted">Bus operator</p>

                <h2 className="mt-1 text-xl font-bold text-primary-dark md:text-2xl">
                  {booking.busId.operator}
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {booking.busId.busType}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3">
                <CalendarDays size={18} className="text-primary" />

                <div>
                  <p className="text-xs text-muted">Journey date</p>

                  <p className="font-semibold text-primary-dark">
                    {journeyDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Route */}

            <div className="mt-8 rounded-2xl border border-slate-200 bg-background p-5 md:p-6">
              <div className="mb-5 flex items-center gap-2">
                <MapPin size={18} className="text-primary" />

                <h3 className="font-bold text-primary-dark">Journey</h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                {/* Departure */}

                <div>
                  <p className="text-sm text-muted">Departure</p>

                  <p className="mt-1 text-2xl font-bold text-primary-dark">
                    {booking.busId.departureTime || "--"}
                  </p>

                  <p className="mt-2 text-sm font-medium text-primary-dark">
                    {booking.busId.source}
                  </p>
                </div>

                {/* Journey icon */}

                <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock3 size={19} />
                </div>

                {/* Arrival */}

                <div className="sm:text-right">
                  <p className="text-sm text-muted">Arrival</p>

                  <p className="mt-1 text-2xl font-bold text-primary-dark">
                    {booking.busId.arrivalTime || "--"}
                  </p>

                  <p className="mt-2 text-sm font-medium text-primary-dark">
                    {booking.busId.destination}
                  </p>
                </div>
              </div>

              {/* Mobile journey indicator */}

              <div className="mt-5 flex items-center gap-2 text-xs text-muted sm:hidden">
                <Clock3 size={14} className="text-primary" />
                <span>
                  {booking.busId.source} → {booking.busId.destination}
                </span>
              </div>
            </div>

            {/* Quick booking details */}

            <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-3">
              <div className="rounded-xl bg-background p-4">
                <p className="text-sm text-muted">Journey date</p>

                <p className="mt-1 font-semibold text-primary-dark">
                  {journeyDate}
                </p>
              </div>

              <div className="rounded-xl bg-background p-4">
                <p className="text-sm text-muted">Seats</p>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {booking.seats.map((seat) => (
                    <Badge key={seat}>{seat}</Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-background p-4">
                <p className="text-sm text-muted">Passenger</p>

                <p className="mt-1 font-semibold text-primary-dark">
                  {booking.passenger.name}
                </p>
              </div>
            </div>

            {/* Passenger details */}

            <div className="mt-6 rounded-2xl border border-slate-200 p-5 md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserRound size={19} />
                </div>

                <div>
                  <h3 className="font-bold text-primary-dark">
                    Passenger details
                  </h3>

                  <p className="text-sm text-muted">
                    Booking passenger information
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
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
                  <p className="flex items-center gap-2 text-muted">
                    <Phone size={14} />
                    Phone
                  </p>

                  <p className="mt-1 font-semibold text-primary-dark">
                    {booking.passenger.phone}
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-muted">
                    <Mail size={14} />
                    Email
                  </p>

                  <p className="mt-1 break-all font-semibold text-primary-dark">
                    {booking.passenger.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment summary */}

            <div className="mt-6 rounded-2xl bg-background p-5 md:p-6">
              <div className="flex items-center gap-2">
                <CreditCardIcon />

                <h3 className="font-bold text-primary-dark">Payment summary</h3>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Seat fare</span>

                  <span className="font-semibold text-primary-dark">
                    ₹{seatFare}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted">Convenience fee</span>

                  <span className="font-semibold text-primary-dark">
                    ₹{convenienceFee}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted">Payment method</span>

                  <span className="font-semibold uppercase text-primary-dark">
                    {booking.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted">Payment status</span>

                  <span className="font-semibold capitalize text-success">
                    {booking.paymentStatus}
                  </span>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary-dark">
                      Total paid
                    </span>

                    <span className="text-2xl font-bold text-primary">
                      ₹{booking.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking created */}

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
              <CheckCircle2 size={14} className="text-success" />

              <span>Booking created on {bookingCreatedDate}</span>
            </div>

            {/* Download ticket */}

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

function CreditCardIcon() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Ticket size={17} />
    </div>
  );
}

export default BookingConfirmationPage;
