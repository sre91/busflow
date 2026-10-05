import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Ticket,
  User,
  XCircle,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { cancelBooking, getBookingById, type Booking } from "../api/bookingApi";

function BookingDetailsPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [booking, setBooking] = useState<Booking | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [isCancelling, setIsCancelling] = useState(false);

  const [cancelMessage, setCancelMessage] = useState("");

  // Load booking

  useEffect(() => {
    const loadBooking = async () => {
      if (!id) {
        setError("Booking ID is missing");

        setLoading(false);

        return;
      }

      try {
        setLoading(true);

        setError("");

        const data = await getBookingById(id);

        setBooking(data);
      } catch (error) {
        console.error("Failed to load booking:", error);

        setError("Unable to load booking details");
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  // Cancel booking

  const handleCancelBooking = async () => {
    if (!id || !booking) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsCancelling(true);

      setCancelMessage("");

      const updatedBooking = await cancelBooking(id);

      setBooking(updatedBooking);

      setCancelMessage("Booking cancelled successfully.");
    } catch (error) {
      console.error("Failed to cancel booking:", error);

      setCancelMessage("Unable to cancel this booking. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Loading

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Ticket size={28} />
          </div>

          <p className="mt-5 text-lg font-semibold text-primary-dark">
            Loading booking details...
          </p>

          <p className="mt-1 text-sm text-muted">
            Please wait while we fetch your booking.
          </p>
        </div>
      </main>
    );
  }

  // Error

  if (error || !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border border-slate-200 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <XCircle size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-primary-dark">
            Booking not found
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-muted">
            {error || "Unable to find this booking."}
          </p>

          <div className="mt-6">
            <Button onClick={() => navigate("/bookings")}>
              Back to my bookings
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  const bus = booking.busId;

  const formattedJourneyDate = new Date(
    `${booking.journeyDate}T00:00:00`,
  ).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedBookingDate = new Date(booking.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

  const isConfirmed = booking.bookingStatus === "confirmed";

  const canCancel =
    booking.bookingStatus === "confirmed" &&
    new Date(booking.journeyDate) >= new Date();

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-12">
        {/* Header */}

        <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge variant={isConfirmed ? "success" : "primary"}>
                <span className="flex items-center gap-1.5">
                  {isConfirmed ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <XCircle size={14} />
                  )}

                  {booking.bookingStatus}
                </span>
              </Badge>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-dark md:text-4xl">
                Booking details
              </h1>

              <p className="mt-2 text-sm text-muted">
                Booking ID: {booking._id}
              </p>
            </div>

            <div className="rounded-xl bg-primary/5 px-5 py-3 sm:text-right">
              <p className="text-xs text-muted">Total paid</p>

              <p className="mt-1 text-2xl font-bold text-primary">
                ₹{booking.totalAmount}
              </p>
            </div>
          </div>
        </div>

        {/* Bus information */}

        <Card className="mt-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Ticket size={21} />
            </div>

            <div>
              <p className="text-sm text-muted">Bus</p>

              <h2 className="text-xl font-bold text-primary-dark">
                {bus?.operator || "Bus information unavailable"}
              </h2>
            </div>
          </div>

          {bus ? (
            <>
              <div className="mt-7 rounded-2xl bg-background p-5">
                <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
                  <div>
                    <p className="text-xs text-muted">From</p>

                    <p className="mt-1 text-xl font-bold text-primary-dark">
                      {bus.source}
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                      <MapPin size={15} />
                      Departure: {bus.departureTime || "Not available"}
                    </p>
                  </div>

                  <div className="hidden md:block">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MapPin size={18} />
                    </div>
                  </div>

                  <div className="md:text-right">
                    <p className="text-xs text-muted">To</p>

                    <p className="mt-1 text-xl font-bold text-primary-dark">
                      {bus.destination}
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-sm text-muted md:justify-end">
                      <Clock3 size={15} />
                      Arrival: {bus.arrivalTime || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs text-muted">Bus type</p>

                  <p className="mt-1 font-semibold text-primary-dark">
                    {bus.busType}
                  </p>
                </div>

                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs text-muted">Journey date</p>

                  <p className="mt-1 font-semibold text-primary-dark">
                    {formattedJourneyDate}
                  </p>
                </div>

                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs text-muted">Seats</p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {booking.seats.map((seat) => (
                      <Badge key={seat}>{seat}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-xl bg-amber-50 p-4">
              <p className="font-semibold text-primary-dark">
                Bus information unavailable
              </p>

              <p className="mt-1 text-sm text-muted">
                The bus associated with this booking is no longer available.
              </p>

              <p className="mt-1 text-sm text-muted">
                Your booking record is still available.
              </p>
            </div>
          )}
        </Card>

        {/* Passenger information */}

        <Card className="mt-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User size={21} />
            </div>

            <div>
              <p className="text-sm text-muted">Passenger</p>

              <h2 className="text-xl font-bold text-primary-dark">
                Passenger details
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Name</p>

              <p className="mt-1 font-semibold text-primary-dark">
                {booking.passenger.name}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Age</p>

              <p className="mt-1 font-semibold text-primary-dark">
                {booking.passenger.age}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                Gender
              </p>

              <p className="mt-1 font-semibold text-primary-dark">
                {booking.passenger.gender}
              </p>
            </div>

            <div className="flex items-start gap-2">
              <Phone size={17} className="mt-0.5 text-primary" />

              <div>
                <p className="text-xs uppercase tracking-wide text-muted">
                  Phone
                </p>

                <p className="mt-1 font-semibold text-primary-dark">
                  {booking.passenger.phone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:col-span-2">
              <Mail size={17} className="mt-0.5 text-primary" />

              <div>
                <p className="text-xs uppercase tracking-wide text-muted">
                  Email
                </p>

                <p className="mt-1 break-all font-semibold text-primary-dark">
                  {booking.passenger.email}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment information */}

        <Card className="mt-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CreditCard size={21} />
            </div>

            <div>
              <p className="text-sm text-muted">Payment</p>

              <h2 className="text-xl font-bold text-primary-dark">
                Payment details
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                Method
              </p>

              <p className="mt-1 font-semibold uppercase text-primary-dark">
                {booking.paymentMethod}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                Status
              </p>

              <p className="mt-1 font-semibold text-success">
                {booking.paymentStatus}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                Booking date
              </p>

              <p className="mt-1 font-semibold text-primary-dark">
                {formattedBookingDate}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                Amount
              </p>

              <p className="mt-1 font-semibold text-primary">
                ₹{booking.totalAmount}
              </p>
            </div>
          </div>
        </Card>

        {/* Cancellation message */}

        {cancelMessage && (
          <div
            className={`mt-6 rounded-xl border px-4 py-3 text-sm font-medium ${
              booking.bookingStatus === "cancelled"
                ? "border-success/20 bg-success/10 text-success"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            {cancelMessage}
          </div>
        )}

        {/* Actions */}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate("/bookings")}
          >
            Back to my bookings
          </Button>

          {canCancel && (
            <Button
              className="w-full bg-red-500 hover:bg-red-600 sm:w-auto"
              disabled={isCancelling}
              onClick={handleCancelBooking}
            >
              {isCancelling ? "Cancelling..." : "Cancel booking"}
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}

export default BookingDetailsPage;
