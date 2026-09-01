import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Ticket,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { cancelBooking, getBookingById, type Booking } from "../api/bookingApi";

function BookingDetailsPage() {
  const { id } = useParams();

  const [booking, setBooking] = useState<Booking | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isCancelling, setIsCancelling] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    const loadBooking = async () => {
      if (!id) {
        setErrorMessage("Booking ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getBookingById(id);

        setBooking(data);
      } catch (error) {
        console.error("Failed to load booking:", error);

        setErrorMessage("Unable to load this booking.");
      } finally {
        setIsLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  const handleCancel = async () => {
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
      setCancelError("");

      const updatedBooking = await cancelBooking(id);

      setBooking(updatedBooking);
    } catch (error) {
      console.error("Failed to cancel booking:", error);

      setCancelError("Unable to cancel the booking. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto max-w-4xl px-6 py-10">
          <Card>
            <div className="animate-pulse space-y-5">
              <div className="h-6 w-48 rounded bg-slate-200" />

              <div className="h-4 w-72 rounded bg-slate-200" />

              <div className="h-32 rounded bg-slate-200" />

              <div className="h-24 rounded bg-slate-200" />
            </div>
          </Card>
        </section>
      </main>
    );
  }

  if (errorMessage || !booking) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto max-w-4xl px-6 py-10">
          <Card className="text-center">
            <XCircle size={48} className="mx-auto text-red-500" />

            <h1 className="mt-5 text-2xl font-bold text-primary-dark">
              Booking not found
            </h1>

            <p className="mt-2 text-muted">
              {errorMessage || "We couldn't find this booking."}
            </p>

            <div className="mt-6">
              <Link to="/bookings">
                <Button>Back to bookings</Button>
              </Link>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  const isCancelled = booking.bookingStatus === "cancelled";

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <Link
          to="/bookings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
        >
          <ArrowLeft size={17} />
          Back to bookings
        </Link>

        <div className="mt-7">
          <Badge variant={isCancelled ? "primary" : "success"}>
            {isCancelled ? "Booking cancelled" : "Booking confirmed"}
          </Badge>

          <h1 className="mt-4 text-3xl font-bold text-primary-dark md:text-4xl">
            Booking details
          </h1>

          <p className="mt-2 text-muted">
            Booking ID:{" "}
            <span className="font-semibold text-primary-dark">
              {booking._id}
            </span>
          </p>
        </div>

        <Card className="mt-8 overflow-hidden p-0">
          <div className="bg-primary-dark p-6 text-white">
            <div className="flex items-center gap-3">
              <Ticket size={26} />

              <div>
                <p className="text-sm text-slate-300">Bus operator</p>

                <h2 className="text-xl font-bold">{booking.busId.operator}</h2>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div>
                <p className="text-sm text-muted">Departure</p>

                <p className="mt-1 text-2xl font-bold text-primary-dark">
                  {booking.busId.departureTime || "Not available"}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <MapPin size={16} />

                  {booking.busId.source}
                </p>
              </div>

              <Clock3 className="hidden text-primary md:block" />

              <div className="md:text-right">
                <p className="text-sm text-muted">Arrival</p>

                <p className="mt-1 text-2xl font-bold text-primary-dark">
                  {booking.busId.arrivalTime || "Not available"}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-muted md:justify-end">
                  <MapPin size={16} />

                  {booking.busId.destination}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted">Bus type</p>

                <p className="mt-1 font-semibold text-primary-dark">
                  {booking.busId.busType}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Seats</p>

                <p className="mt-1 font-semibold text-primary-dark">
                  {booking.seats.join(", ")}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Payment</p>

                <p className="mt-1 font-semibold capitalize text-primary-dark">
                  {booking.paymentMethod}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Status</p>

                <p
                  className={`mt-1 font-semibold capitalize ${
                    isCancelled ? "text-red-500" : "text-success"
                  }`}
                >
                  {booking.bookingStatus}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <div className="flex items-center gap-3">
              <CalendarDays size={22} className="text-primary" />

              <h2 className="text-xl font-bold text-primary-dark">
                Passenger details
              </h2>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted">Name</span>

                <span className="font-semibold text-primary-dark">
                  {booking.passenger.name}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted">Age</span>

                <span className="font-semibold text-primary-dark">
                  {booking.passenger.age}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted">Gender</span>

                <span className="font-semibold capitalize text-primary-dark">
                  {booking.passenger.gender}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted">Phone</span>

                <span className="font-semibold text-primary-dark">
                  {booking.passenger.phone}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted">Email</span>

                <span className="break-all text-right font-semibold text-primary-dark">
                  {booking.passenger.email}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-primary-dark">
              Payment summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Total amount</span>

                <span className="font-semibold text-primary-dark">
                  ₹{booking.totalAmount}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted">Payment status</span>

                <span className="font-semibold capitalize text-success">
                  {booking.paymentStatus}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold text-primary-dark">
                    Amount paid
                  </span>

                  <span className="text-2xl font-bold text-primary">
                    ₹{booking.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {!isCancelled && (
          <Card className="mt-6 border border-red-100">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-primary-dark">Need to cancel?</h2>

                <p className="mt-1 text-sm text-muted">
                  Cancelling this booking will release your selected seats.
                </p>
              </div>

              <Button disabled={isCancelling} onClick={handleCancel}>
                {isCancelling ? "Cancelling..." : "Cancel booking"}
              </Button>
            </div>

            {cancelError && (
              <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                {cancelError}
              </div>
            )}
          </Card>
        )}

        {isCancelled && (
          <Card className="mt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={22} className="mt-0.5 text-success" />

              <div>
                <h2 className="font-bold text-primary-dark">
                  Booking cancelled
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Your seats have been released and are available for booking
                  again.
                </p>
              </div>
            </div>
          </Card>
        )}
      </section>
    </main>
  );
}

export default BookingDetailsPage;
