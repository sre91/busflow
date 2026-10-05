import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BusFront,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";

function HomePage() {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = () => {
    if (!from.trim()) {
      setErrorMessage("Please enter your departure city.");
      return;
    }

    if (!to.trim()) {
      setErrorMessage("Please enter your destination city.");
      return;
    }

    if (!date) {
      setErrorMessage("Please select your travel date.");
      return;
    }

    setErrorMessage("");

    const searchParams = new URLSearchParams();

    searchParams.set("source", from.trim());
    searchParams.set("destination", to.trim());
    searchParams.set("date", date);

    navigate(`/search?${searchParams.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}

      <section className="relative overflow-hidden">
        {/* Decorative background */}

        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 md:pb-28 md:pt-24">
          {/* Hero Content */}

          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="primary">
              <span className="flex items-center justify-center gap-1.5">
                <Sparkles size={14} />
                Smart bus travel
              </span>
            </Badge>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-primary-dark sm:mt-6 sm:text-5xl md:text-6xl">
              Your journey starts
              <span className="block text-primary">with BusFlow</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-muted sm:mt-6 sm:text-base sm:leading-7 md:text-lg">
              Find the right bus, choose your seat, book your journey, and get
              intelligent travel assistance — all in one place.
            </p>
          </div>

          {/* Search Card */}

          <Card className="mx-auto mt-8 max-w-5xl border border-slate-200 shadow-xl shadow-slate-200/50 sm:mt-12">
            <div className="mb-5 flex items-center gap-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BusFront size={21} />
              </div>

              <div className="min-w-0">
                <h2 className="font-bold text-primary-dark">Find your bus</h2>

                <p className="text-sm text-muted">
                  Enter your journey details to get started
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {/* From */}

              <div>
                <Label htmlFor="from">From</Label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <Input
                    id="from"
                    value={from}
                    onChange={(event) => {
                      setFrom(event.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="Departure city"
                    className="pl-11"
                  />
                </div>
              </div>

              {/* To */}

              <div>
                <Label htmlFor="to">To</Label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <Input
                    id="to"
                    value={to}
                    onChange={(event) => {
                      setTo(event.target.value);
                      setErrorMessage("");
                    }}
                    placeholder="Destination city"
                    className="pl-11"
                  />
                </div>
              </div>

              {/* Date */}

              <div>
                <Label htmlFor="date">Travel date</Label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <Input
                    id="date"
                    type="date"
                    value={date}
                    min={today}
                    onChange={(event) => {
                      setDate(event.target.value);
                      setErrorMessage("");
                    }}
                    className="pl-11"
                  />
                </div>
              </div>
            </div>

            {/* Error */}

            {errorMessage && (
              <div className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                <span className="shrink-0 font-bold">!</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Find Bus */}

            <div className="mt-6">
              <Button
                type="button"
                onClick={handleSearch}
                className="w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-2">
                  <Search size={18} />
                  Find Bus
                  <ArrowRight size={17} />
                </span>
              </Button>
            </div>
          </Card>

          {/* Trust points */}

          <div className="mx-auto mt-7 flex max-w-3xl flex-col items-center justify-center gap-3 text-sm text-muted sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-primary" />
              Easy booking
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-primary" />
              Live seat availability
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-primary" />
              AI travel assistance
            </span>
          </div>
        </div>
      </section>

      {/* Features */}

      <section className="border-t border-slate-200 bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:py-20">
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Why BusFlow
            </p>

            <h2 className="mt-2 text-2xl font-bold text-primary-dark sm:text-3xl">
              Everything you need for a better journey
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted">
              From finding your bus to choosing your seat, BusFlow keeps the
              entire booking experience simple.
            </p>
          </div>

          <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
            {/* Feature 1 */}

            <Card className="group border border-slate-200 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-105">
                <Search size={22} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-primary-dark">
                Easy Bus Search
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-muted">
                Search buses by route and travel date with simple filters and an
                intuitive booking experience.
              </p>
            </Card>

            {/* Feature 2 */}

            <Card className="group border border-slate-200 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-105">
                <BusFront size={22} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-primary-dark">
                Live Seat Selection
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-muted">
                View available seats in real time and choose the seat that works
                best for your journey.
              </p>
            </Card>

            {/* Feature 3 */}

            <Card className="group border border-slate-200 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-105">
                <Sparkles size={22} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-primary-dark">
                AI Travel Assistant
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-muted">
                Get intelligent travel help while planning your route and
                booking your journey.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
