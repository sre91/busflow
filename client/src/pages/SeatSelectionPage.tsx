import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Armchair, Check, UserRound } from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

import { getBusById, getSeatsByBus, type Bus, type Seat } from "../api/busApi";

import { useAppDispatch } from "../app/hooks";

import {
  setBookingBus,
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

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchSeatData = async () => {
      if (!id) {
        setError("Bus ID is missing");
        setLoading(false);
        return;
      }

      try {
        const [busData, seatData] = await Promise.all([
          getBusById(id),
          getSeatsByBus(id),
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
      } catch (error) {
        console.error("Failed to fetch seat data:", error);

        setError("Unable to load seat information");
      } finally {
        setLoading(false);
      }
    };

    fetchSeatData();
  }, [id, dispatch]);

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

  const totalPrice = selectedSeats.reduce((total, seatNumber) => {
    const seat = seats.find(
      (currentSeat) => currentSeat.seatNumber === seatNumber,
    );

    return total + (seat?.price ?? 0);
  }, 0);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg font-medium text-primary-dark">
          Loading seats... 💺
        </p>
      </main>
    );
  }

  if (error || !bus) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Card className="text-center">
          <h2 className="text-xl font-bold text-primary-dark">
            Unable to load seat information
          </h2>

          <p className="mt-2 text-muted">{error || "Bus not found"}</p>

          <div className="mt-6">
            <Button onClick={() => navigate("/search")}>Back to buses</Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <Badge variant="primary">Seat selection</Badge>

          <h1 className="mt-4 text-3xl font-bold text-primary-dark md:text-4xl">
            Choose your seats
          </h1>

          <p className="mt-2 text-muted">
            {bus.operator} · {bus.source} → {bus.destination}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Bus Layout */}
          <Card className="flex flex-col items-center">
            <div className="w-full max-w-md">
              <div className="rounded-2xl bg-primary-dark p-4 text-center text-white">
                <div className="flex items-center justify-center gap-2">
                  <UserRound size={18} />
                  <span className="font-semibold">Driver</span>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border-2 border-slate-200 bg-surface p-5">
                <div className="mb-6 text-center text-sm font-semibold text-muted">
                  Front of bus
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
                                  className={`
                                    flex
                                    w-full
                                    flex-col
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    p-2
                                    transition
                                    ${
                                      seat.status === "booked"
                                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                                        : isSelected
                                          ? "border-primary bg-primary text-white shadow-md"
                                          : "border-slate-200 bg-surface text-primary-dark hover:border-primary hover:bg-primary/5"
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
              <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-surface ring-1 ring-slate-300" />
                  Available
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-primary" />
                  Selected
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded bg-slate-200" />
                  Booked
                </div>
              </div>
            </div>
          </Card>

          {/* Booking Summary */}
          <Card className="h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-primary-dark">
              Booking summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted">Bus</span>

                <span className="font-semibold text-primary-dark">
                  {bus.operator}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Seats</span>

                <span className="font-semibold text-primary-dark">
                  {selectedSeats.length}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-muted">Selected seats</p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((seat) => (
                      <Badge key={seat}>{seat}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted">
                      No seats selected
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-muted">Total</p>

                <p className="mt-1 text-3xl font-bold text-primary">
                  ₹{totalPrice}
                </p>
              </div>
            </div>

            <div className="mt-7">
              <Button
                disabled={selectedSeats.length === 0}
                onClick={() => navigate(`/bus/${id}/passenger`)}
              >
                Continue
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default SeatSelectionPage;
