import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BusFront,
  CalendarDays,
  Check,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import Badge from "../components/ui/Badge";
import BusCard from "../components/ui/BusCard";
import Card from "../components/ui/Card";
import { getBuses, type Bus } from "../api/busApi";

function SearchResultsPage() {
  const [searchParams] = useSearchParams();

  const source = searchParams.get("source") || "";

  const destination = searchParams.get("destination") || "";

  const date = searchParams.get("date") || "";

  const [buses, setBuses] = useState<Bus[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showAcOnly, setShowAcOnly] = useState(false);

  const [showSleeperOnly, setShowSleeperOnly] = useState(false);

  const [showSeaterOnly, setShowSeaterOnly] = useState(false);

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getBuses({
          source,
          destination,
        });

        console.log("🔍 Search source:", source);
        console.log("🔍 Search destination:", destination);
        console.log("🔍 Buses received from API:", data);

        setBuses(data);
      } catch (error) {
        console.error("Failed to fetch buses:", error);

        setError("Unable to load buses");
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [source, destination]);

  const filteredBuses = buses.filter((bus) => {
    if (showAcOnly && !bus.busType.includes("AC")) {
      return false;
    }

    if (showSleeperOnly && !bus.busType.includes("Sleeper")) {
      return false;
    }

    if (showSeaterOnly && !bus.busType.includes("Seater")) {
      return false;
    }

    return true;
  });

  const formattedDate = date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Any date";

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="animate-pulse">
            <div className="h-5 w-28 rounded-lg bg-slate-200" />

            <div className="mt-5 h-10 w-96 max-w-full rounded-lg bg-slate-200" />

            <div className="mt-3 h-5 w-72 max-w-full rounded-lg bg-slate-200" />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[240px_1fr]">
            <Card>
              <div className="animate-pulse space-y-5">
                <div className="h-6 w-24 rounded bg-slate-200" />
                <div className="h-4 w-20 rounded bg-slate-200" />
                <div className="h-4 w-28 rounded bg-slate-200" />
                <div className="h-4 w-24 rounded bg-slate-200" />
              </div>
            </Card>

            <div className="space-y-5">
              <Card className="h-48 animate-pulse">
                <div className="space-y-4">
                  <div className="h-5 w-40 rounded bg-slate-200" />
                  <div className="h-8 w-72 rounded bg-slate-200" />
                  <div className="h-4 w-56 rounded bg-slate-200" />
                </div>
              </Card>

              <Card className="h-48 animate-pulse">
                <div className="space-y-4">
                  <div className="h-5 w-40 rounded bg-slate-200" />
                  <div className="h-8 w-72 rounded bg-slate-200" />
                  <div className="h-4 w-56 rounded bg-slate-200" />
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 py-10">
          <Card className="w-full max-w-md border border-slate-200 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Search size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-primary-dark">
              Unable to load buses
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              {error}. Please try your search again.
            </p>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        {/* Search Header */}

        <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm md:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge variant="primary">
                <span className="flex items-center gap-1.5">
                  <BusFront size={14} />
                  Bus search
                </span>
              </Badge>

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-primary-dark md:text-3xl">
                {source || "Any location"}
                <span className="mx-2 text-primary">→</span>
                {destination || "Any destination"}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
                <span className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  {formattedDate}
                </span>

                <span className="flex items-center gap-2">
                  <BusFront size={16} />
                  {filteredBuses.length}{" "}
                  {filteredBuses.length === 1 ? "bus" : "buses"} available
                </span>
              </div>
            </div>

            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary md:flex">
              <SlidersHorizontal size={22} />
            </div>
          </div>
        </div>

        {/* Content */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Filters */}

          <Card className="h-fit border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Filter size={19} className="text-primary" />

              <h2 className="text-lg font-bold text-primary-dark">Filters</h2>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-primary-dark">
                Bus type
              </p>

              <div className="mt-4 space-y-3">
                {/* AC */}

                <label className="group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-background">
                  <span className="flex items-center gap-3 text-sm text-muted">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                        showAcOnly
                          ? "border-primary bg-primary text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {showAcOnly && <Check size={13} />}
                    </span>
                    AC
                  </span>

                  <input
                    type="checkbox"
                    checked={showAcOnly}
                    onChange={(event) => setShowAcOnly(event.target.checked)}
                    className="sr-only"
                  />
                </label>

                {/* Sleeper */}

                <label className="group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-background">
                  <span className="flex items-center gap-3 text-sm text-muted">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                        showSleeperOnly
                          ? "border-primary bg-primary text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {showSleeperOnly && <Check size={13} />}
                    </span>
                    Sleeper
                  </span>

                  <input
                    type="checkbox"
                    checked={showSleeperOnly}
                    onChange={(event) =>
                      setShowSleeperOnly(event.target.checked)
                    }
                    className="sr-only"
                  />
                </label>

                {/* Seater */}

                <label className="group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-background">
                  <span className="flex items-center gap-3 text-sm text-muted">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                        showSeaterOnly
                          ? "border-primary bg-primary text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {showSeaterOnly && <Check size={13} />}
                    </span>
                    Seater
                  </span>

                  <input
                    type="checkbox"
                    checked={showSeaterOnly}
                    onChange={(event) =>
                      setShowSeaterOnly(event.target.checked)
                    }
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
          </Card>

          {/* Bus Results */}

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-primary-dark">
                  Available buses
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Choose the option that works best for your journey.
                </p>
              </div>

              <div className="hidden items-center gap-2 text-sm text-muted sm:flex">
                <MapPin size={16} />
                {source} → {destination}
              </div>
            </div>

            {filteredBuses.length > 0 ? (
              filteredBuses.map((bus) => (
                <BusCard
                  key={bus._id}
                  id={bus._id}
                  operator={bus.operator}
                  busType={bus.busType}
                  departure={bus.departureTime}
                  arrival={bus.arrivalTime}
                  route={`${bus.source} → ${bus.destination}`}
                  rating={bus.rating}
                  seatsAvailable={bus.availableSeats}
                  price={bus.price}
                  journeyDate={date}
                />
              ))
            ) : (
              <Card className="border border-slate-200 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <BusFront size={25} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-primary-dark">
                  No buses found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
                  We couldn't find buses matching your current filters. Try
                  removing a filter or searching for another route.
                </p>
              </Card>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default SearchResultsPage;
