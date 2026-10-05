import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Armchair,
  BusFront,
  CalendarDays,
  Check,
  CircleHelp,
  UserRound,
} from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { getBusById, getSeatsByBus, type Bus, type Seat } from "../api/busApi";

import { useAppDispatch } from "../app/hooks";

import {
  setBookingBus,
  setJourneyDate,
  setSelectedSeats as saveSelectedSeats,
} from "../features/booking/bookingSlice";

function SeatSelectionPage() {
  const [bus, setBus] = useState<Bus | null>(null);

  const [seats, setSeats] = useState<Seat[]>([]);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { id } = useParams();

  const [searchParams] = useSearchParams();

  const dispatch = useAppDispatch();

  const journeyDate = searchParams.get("journeyDate") || "";

  // Fetch bus and seat information

  useEffect(() => {
    const fetchSeatData = async () => {
      if (!id) {
        setError("Bus ID is missing");

        setLoading(false);

        return;
      }

      if (!journeyDate) {
        setError("Journey date is missing");

        setLoading(false);

        return;
      }

      try {
        const [busData, seatData] = await Promise.all([
          getBusById(id),
          getSeatsByBus(id, journeyDate),
        ]);

        setBus(busData);

        setSeats(seatData);

        dispatch(
          setBookingBus({
            busId: busData._id,
            busOperator: busData.operator,
            source: busData.source,
            destination: busData.destination,
          }),
        );

        dispatch(setJourneyDate(journeyDate));

        setError("");
      } catch (error) {
        console.error("Failed to fetch seat data:", error);

        setError("Unable to load seat information");
      } finally {
        setLoading(false);
      }
    };

    fetchSeatData();
  }, [id, journeyDate, dispatch]);

  // Select / deselect seat

  const toggleSeat = (seat: Seat) => {
    if (seat.status === "booked") {
      return;
    }

    setSelectedSeats((currentSeats) => {
      let updatedSeats: string[];

      if (currentSeats.includes(seat.seatNumber)) {
        updatedSeats = currentSeats.filter(
          (selectedSeat) => selectedSeat !== seat.seatNumber,
        );
      } else {
        updatedSeats = [...currentSeats, seat.seatNumber];
      }

      const totalAmount = updatedSeats.reduce((total, seatNumber) => {
        const selectedSeat = seats.find(
          (currentSeat) => currentSeat.seatNumber === seatNumber,
        );

        return total + (selectedSeat?.price ?? 0);
      }, 0);

      dispatch(
        saveSelectedSeats({
          seats: updatedSeats,
          totalAmount,
        }),
      );

      return updatedSeats;
    });
  };

  // Calculate total price

  const totalPrice = selectedSeats.reduce((total, seatNumber) => {
    const seat = seats.find(
      (currentSeat) => currentSeat.seatNumber === seatNumber,
    );

    return total + (seat?.price ?? 0);
  }, 0);

  const formattedJourneyDate = journeyDate
    ? new Date(`${journeyDate}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  // Loading state

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="animate-pulse">
            <div className="h-5 w-32 rounded-lg bg-slate-200" />

            <div className="mt-5 h-10 w-80 max-w-full rounded-lg bg-slate-200" />

            <div className="mt-3 h-5 w-96 max-w-full rounded-lg bg-slate-200" />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card className="h-[620px]">
              <div className="h-full animate-pulse">
                <div className="mx-auto h-12 max-w-md rounded-xl bg-slate-200" />

                <div className="mx-auto mt-6 h-[480px] max-w-md rounded-3xl bg-slate-200" />
              </div>
            </Card>

            <Card className="h-80">
              <div className="animate-pulse space-y-5">
                <div className="h-6 w-40 rounded bg-slate-200" />

                <div className="h-4 w-full rounded bg-slate-200" />

                <div className="h-4 w-full rounded bg-slate-200" />

                <div className="h-4 w-24 rounded bg-slate-200" />

                <div className="h-10 w-32 rounded bg-slate-200" />

                <div className="h-12 w-full rounded-xl bg-slate-200" />
              </div>
            </Card>
          </div>
        </section>
      </main>
    );
  }

  // Error state

  if (error || !bus) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 py-10">
          <Card className="w-full max-w-md border border-slate-200 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Armchair size={25} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-primary-dark">
              Unable to load seats
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              {error || "Bus not found"}
            </p>

            <div className="mt-6">
              <Button onClick={() => navigate("/search")}>Back to buses</Button>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        {/* Header */}

        <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge variant="primary">
                <span className="flex items-center gap-1.5">
                  <Armchair size={14} />
                  Seat selection
                </span>
              </Badge>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-dark md:text-4xl">
                Choose your seats
              </h1>

              <p className="mt-2 text-sm text-muted md:text-base">
                {bus.operator}
                <span className="mx-2 text-slate-300">•</span>
                {bus.source}
                <span className="mx-2 text-primary">→</span>
                {bus.destination}
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary">
              <CalendarDays size={17} />

              {formattedJourneyDate}
            </div>
          </div>
        </div>

        {/* Main content */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Bus Layout */}

          <Card className="border border-slate-200 shadow-sm">
            <div className="mx-auto w-full max-w-md">
              {/* Driver */}

              <div className="rounded-2xl bg-primary-dark p-4 text-center text-white shadow-sm">
                <div className="flex items-center justify-center gap-2">
                  <UserRound size={18} />

                  <span className="font-semibold">Driver</span>
                </div>
              </div>

              {/* Bus */}

              <div className="mt-5 rounded-[2rem] border-2 border-slate-200 bg-surface p-5 shadow-sm">
                <div className="mb-7 flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Front of bus
                  </span>

                  <BusFront size={20} className="text-primary" />
                </div>

                <div className="space-y-4">
                  {Array.from(
                    {
                      length: Math.ceil(seats.length / 4),
                    },
                    (_, rowIndex) => {
                      const rowNumber = rowIndex + 1;

                      const rowSeats = seats.slice(
                        rowIndex * 4,
                        rowIndex * 4 + 4,
                      );

                      return (
                        <div
                          key={rowNumber}
                          className="grid grid-cols-[1fr_1fr_32px_1fr_1fr] gap-2"
                        >
                          {rowSeats.map((seat, index) => {
                            const isSelected = selectedSeats.includes(
                              seat.seatNumber,
                            );

                            return (
                              <div
                                key={seat._id}
                                className={
                                  index === 2 ? "col-start-4" : undefined
                                }
                              >
                                <button
                                  type="button"
                                  disabled={seat.status === "booked"}
                                  onClick={() => toggleSeat(seat)}
                                  aria-label={`Seat ${seat.seatNumber}${
                                    seat.status === "booked"
                                      ? ", booked"
                                      : isSelected
                                        ? ", selected"
                                        : ", available"
                                  }`}
                                  className={`
                                    flex
                                    min-h-[62px]
                                    w-full
                                    cursor-pointer
                                    flex-col
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    p-2
                                    transition
                                    duration-150
                                    ${
                                      seat.status === "booked"
                                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                                        : isSelected
                                          ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                                          : "border-slate-200 bg-surface text-primary-dark hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 hover:shadow-sm"
                                    }
                                  `}
                                >
                                  {isSelected ? (
                                    <Check size={18} />
                                  ) : (
                                    <Armchair size={18} />
                                  )}

                                  <span className="mt-1 text-xs font-semibold">
                                    {seat.seatNumber}
                                  </span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Legend */}

              <div className="mt-6 rounded-2xl bg-background p-4">
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-md bg-surface ring-1 ring-slate-300" />
                    Available
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-md bg-primary" />
                    Selected
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-md bg-slate-200" />
                    Booked
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Booking Summary */}

          <Card className="h-fit border border-slate-200 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Armchair size={18} />
              </div>

              <h2 className="text-xl font-bold text-primary-dark">
                Booking summary
              </h2>
            </div>

            <div className="mt-6 space-y-5">
              {/* Bus */}

              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-muted">Bus</span>

                <span className="max-w-[180px] text-right text-sm font-semibold text-primary-dark">
                  {bus.operator}
                </span>
              </div>

              {/* Journey date */}

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted">Journey date</span>

                <span className="text-right text-sm font-semibold text-primary-dark">
                  {formattedJourneyDate}
                </span>
              </div>

              {/* Seats */}

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted">Seats selected</span>

                <span className="text-sm font-semibold text-primary-dark">
                  {selectedSeats.length}
                </span>
              </div>

              {/* Selected seats */}

              <div className="border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted">
                    Selected seats
                  </p>

                  <CircleHelp size={15} className="text-muted" />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((seat) => (
                      <Badge key={seat}>{seat}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted">
                      Select one or more seats
                    </span>
                  )}
                </div>
              </div>

              {/* Total */}

              <div className="border-t border-slate-200 pt-5">
                <p className="text-sm text-muted">Total fare</p>

                <p className="mt-1 text-3xl font-bold text-primary-dark">
                  ₹{totalPrice}
                </p>

                {selectedSeats.length > 0 && (
                  <p className="mt-1 text-xs text-muted">
                    {selectedSeats.length}{" "}
                    {selectedSeats.length === 1 ? "seat" : "seats"} selected
                  </p>
                )}
              </div>
            </div>

            {/* Continue */}

            <div className="mt-7">
              <Button
                disabled={selectedSeats.length === 0}
                onClick={() =>
                  navigate(
                    `/bus/${id}/passenger?journeyDate=${encodeURIComponent(
                      journeyDate,
                    )}`,
                  )
                }
              >
                <span className="flex items-center justify-center gap-2">
                  Continue
                  <Check size={17} />
                </span>
              </Button>
            </div>

            <p className="mt-4 text-center text-xs leading-relaxed text-muted">
              Select your preferred seats before continuing.
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default SeatSelectionPage;
