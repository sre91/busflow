import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

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
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg font-medium text-primary-dark">
          Searching for buses... 🚌
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Card className="text-center">
          <h2 className="text-lg font-bold text-primary-dark">
            Unable to load buses
          </h2>

          <p className="mt-2 text-muted">{error}</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <Badge variant="primary">Bus search</Badge>

          <h1 className="mt-4 text-3xl font-bold text-primary-dark md:text-4xl">
            {source || "Any location"} → {destination || "Any destination"}
          </h1>

          <p className="mt-2 text-muted">
            {formattedDate} · {filteredBuses.length} buses available
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Filters */}
          <Card className="h-fit">
            <h2 className="text-lg font-bold text-primary-dark">Filters</h2>

            <div className="mt-6">
              <p className="font-semibold text-primary-dark">Bus type</p>

              <div className="mt-3 space-y-3 text-sm text-muted">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={showAcOnly}
                    onChange={(event) => setShowAcOnly(event.target.checked)}
                  />
                  AC
                </label>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={showSleeperOnly}
                    onChange={(event) =>
                      setShowSleeperOnly(event.target.checked)
                    }
                  />
                  Sleeper
                </label>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={showSeaterOnly}
                    onChange={(event) =>
                      setShowSeaterOnly(event.target.checked)
                    }
                  />
                  Seater
                </label>
              </div>
            </div>
          </Card>

          {/* Bus Results */}
          <div className="space-y-5">
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
                />
              ))
            ) : (
              <Card className="text-center">
                <h2 className="text-lg font-bold text-primary-dark">
                  No buses found
                </h2>

                <p className="mt-2 text-muted">
                  No buses are available for this route.
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
