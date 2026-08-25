import { CheckCircle2, Clock3, Download, MapPin, Ticket } from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

function BookingConfirmationPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 size={42} />
          </div>

          <Badge variant="success">Booking confirmed</Badge>

          <h1 className="mt-5 text-3xl font-bold text-primary-dark md:text-4xl">
            Your trip is booked! 🎉
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-muted">
            Your booking has been confirmed. Keep your booking ID handy for your
            journey.
          </p>
        </div>

        <Card className="mt-10 overflow-hidden p-0">
          <div className="border-b border-slate-200 bg-primary-dark p-6 text-white">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Ticket size={24} />

                <div>
                  <p className="text-sm text-slate-300">Booking ID</p>

                  <p className="font-bold">BF-2026-00128</p>
                </div>
              </div>

              <Badge variant="success">Confirmed</Badge>
            </div>
          </div>

          <div className="p-6">
            <div>
              <h2 className="text-xl font-bold text-primary-dark">
                BlueLine Travels
              </h2>

              <p className="mt-1 text-sm text-muted">AC Sleeper</p>
            </div>

            <div className="mt-7 grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div>
                <p className="text-sm text-muted">Departure</p>

                <p className="mt-1 text-2xl font-bold text-primary-dark">
                  10:30 PM
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <MapPin size={16} />
                  Chennai
                </p>
              </div>

              <div className="hidden sm:block">
                <Clock3 className="text-primary" />
              </div>

              <div className="sm:text-right">
                <p className="text-sm text-muted">Arrival</p>

                <p className="mt-1 text-2xl font-bold text-primary-dark">
                  06:30 AM
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-muted sm:justify-end">
                  <MapPin size={16} />
                  Bangalore
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted">Travel date</p>

                <p className="mt-1 font-semibold text-primary-dark">
                  25 Aug 2026
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Seat</p>

                <p className="mt-1 font-semibold text-primary-dark">1A</p>
              </div>

              <div>
                <p className="text-sm text-muted">Passenger</p>

                <p className="mt-1 font-semibold text-primary-dark">Sree</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-background p-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Seat fare</span>

                <span className="font-semibold text-primary-dark">₹899</span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-muted">Convenience fee</span>

                <span className="font-semibold text-primary-dark">₹49</span>
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold text-primary-dark">
                    Total paid
                  </span>

                  <span className="text-xl font-bold text-primary">₹948</span>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <Button>
                <span className="flex items-center justify-center gap-2">
                  <Download size={18} />
                  Download Ticket
                </span>
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center text-sm text-muted">
          A confirmation has been sent to your registered email and phone
          number.
        </div>
      </section>
    </main>
  );
}

export default BookingConfirmationPage;
