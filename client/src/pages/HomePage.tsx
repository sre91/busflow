import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Search,
  Zap,
  Armchair,
  Sparkles,
} from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import RouteCard from "../components/ui/RouteCard";
import FeatureCard from "../components/ui/FeatureCard";
import AiFeature from "../components/ui/AiFeature";

function HomePage() {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = () => {
    if (!from.trim() || !to.trim()) {
      return;
    }

    const searchParams = new URLSearchParams({
      source: from.trim(),
      destination: to.trim(),
    });

    if (date) {
      searchParams.set("date", date);
    }

    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero + Search */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Hero Content */}
          <div>
            <Badge variant="primary">Smart bus booking</Badge>

            <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight text-primary-dark md:text-6xl">
              Travel smarter.
              <br />
              <span className="text-primary">Go farther.</span> 🚌
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Find buses, choose your perfect seat, and book your journey with a
              smarter travel experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted">
              <span>✓ Easy booking</span>
              <span>✓ Real-time seats</span>
              <span>✓ Smart recommendations</span>
            </div>
          </div>

          {/* Search Card */}
          <Card className="w-full p-7 shadow-md">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark">
                Where are you going?
              </h2>

              <p className="mt-2 text-muted">
                Search buses and find your perfect journey.
              </p>
            </div>

            <div className="mt-7 space-y-5">
              {/* From */}
              <div>
                <Label htmlFor="from">From</Label>

                <div className="relative">
                  <MapPin
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <Input
                    id="from"
                    placeholder="Departure city"
                    className="pl-11"
                    value={from}
                    onChange={(event) => setFrom(event.target.value)}
                  />
                </div>
              </div>

              {/* To */}
              <div>
                <Label htmlFor="to">To</Label>

                <div className="relative">
                  <MapPin
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <Input
                    id="to"
                    placeholder="Destination city"
                    className="pl-11"
                    value={to}
                    onChange={(event) => setTo(event.target.value)}
                  />
                </div>
              </div>

              {/* Travel Date */}
              <div>
                <Label htmlFor="date">Travel date</Label>

                <div className="relative">
                  <CalendarDays
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <Input
                    id="date"
                    type="date"
                    className="pl-11"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                  />
                </div>
              </div>

              {/* Search Button */}
              <Button onClick={handleSearch}>
                <span className="flex items-center justify-center gap-2">
                  <Search size={18} />
                  Search Buses
                </span>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge variant="primary">Explore routes</Badge>

            <h2 className="mt-4 text-3xl font-bold text-primary-dark md:text-4xl">
              Popular journeys
            </h2>

            <p className="mt-3 max-w-2xl text-muted">
              Discover some of the most popular bus routes on BusFlow.
            </p>
          </div>

          <button
            type="button"
            className="font-semibold text-primary transition hover:text-primary-dark"
          >
            View all routes →
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <RouteCard from="Chennai" to="Bangalore" price={699} />

          <RouteCard from="Bangalore" to="Chennai" price={599} />

          <RouteCard from="Chennai" to="Hyderabad" price={799} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="text-center">
          <Badge variant="primary">Why BusFlow</Badge>

          <h2 className="mt-4 text-3xl font-bold text-primary-dark md:text-4xl">
            Built for better journeys
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-muted">
            Everything you need to make bus travel simpler, smarter, and more
            comfortable.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Zap size={24} />}
            title="Real-time availability"
            description="See current seat availability and stay updated without refreshing the page."
          />

          <FeatureCard
            icon={<Armchair size={24} />}
            title="Choose your perfect seat"
            description="Explore the bus layout and select the seat that works best for your journey."
          />

          <FeatureCard
            icon={<Sparkles size={24} />}
            title="Smart recommendations"
            description="Get helpful travel suggestions based on your journey and preferences."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <AiFeature />
      </section>
    </main>
  );
}

export default HomePage;
