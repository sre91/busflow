import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Armchair, Check, UserRound } from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

type SeatStatus = "available" | "booked";

type Seat = {
  id: string;
  price: number;
  status: SeatStatus;
};

const seats: Seat[] = [
  { id: "1A", price: 899, status: "available" },
  { id: "1B", price: 899, status: "available" },
  { id: "1C", price: 899, status: "booked" },
  { id: "1D", price: 899, status: "available" },

  { id: "2A", price: 899, status: "available" },
  { id: "2B", price: 899, status: "booked" },
  { id: "2C", price: 899, status: "available" },
  { id: "2D", price: 899, status: "available" },

  { id: "3A", price: 899, status: "available" },
  { id: "3B", price: 899, status: "available" },
  { id: "3C", price: 899, status: "available" },
  { id: "3D", price: 899, status: "booked" },

  { id: "4A", price: 899, status: "available" },
  { id: "4B", price: 899, status: "available" },
  { id: "4C", price: 899, status: "available" },
  { id: "4D", price: 899, status: "available" },

  { id: "5A", price: 899, status: "booked" },
  { id: "5B", price: 899, status: "available" },
  { id: "5C", price: 899, status: "available" },
  { id: "5D", price: 899, status: "available" },
];

function SeatSelectionPage() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const toggleSeat = (seat: Seat) => {
    if (seat.status === "booked") {
      return;
    }

    setSelectedSeats((currentSeats) => {
      if (currentSeats.includes(seat.id)) {
        return currentSeats.filter((selectedSeat) => selectedSeat !== seat.id);
      }

      return [...currentSeats, seat.id];
    });
  };

  const totalPrice = selectedSeats.length * 899;

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <Badge variant="primary">Seat selection</Badge>

          <h1 className="mt-4 text-3xl font-bold text-primary-dark md:text-4xl">
            Choose your seats
          </h1>

          <p className="mt-2 text-muted">
            BlueLine Travels · Chennai → Bangalore
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
                  {Array.from({ length: 5 }, (_, rowIndex) => {
                    const rowNumber = rowIndex + 1;

                    const rowSeats = seats.filter((seat) =>
                      seat.id.startsWith(`${rowNumber}`),
                    );

                    return (
                      <div
                        key={rowNumber}
                        className="grid grid-cols-[1fr_1fr_32px_1fr_1fr] gap-2"
                      >
                        {rowSeats.map((seat, index) => {
                          const isSelected = selectedSeats.includes(seat.id);

                          return (
                            <div
                              key={seat.id}
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
                                  {seat.id}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
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
                  BlueLine Travels
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
