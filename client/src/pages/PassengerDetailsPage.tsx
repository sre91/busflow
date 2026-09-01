import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Mail, Phone, UserRound } from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setPassenger } from "../features/booking/bookingSlice";

type PassengerForm = {
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
};

function PassengerDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const dispatch = useAppDispatch();

  const {
    busOperator,
    source,
    destination,
    journeyDate,
    selectedSeats,
    totalAmount,
  } = useAppSelector((state) => state.booking);

  const urlJourneyDate = searchParams.get("journeyDate") || journeyDate;

  const [passenger, setPassengerForm] = useState<PassengerForm>({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
  });

  const handleChange = (field: keyof PassengerForm, value: string) => {
    setPassengerForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const isFormValid =
    passenger.name.trim() !== "" &&
    passenger.age.trim() !== "" &&
    passenger.gender !== "" &&
    passenger.phone.trim() !== "" &&
    passenger.email.trim() !== "";

  const convenienceFee = 49;

  const finalTotal = totalAmount + convenienceFee;

  const handleContinue = () => {
    if (!isFormValid) {
      return;
    }

    dispatch(setPassenger(passenger));

    navigate(
      `/bus/${id}/payment?journeyDate=${encodeURIComponent(urlJourneyDate)}`,
    );
  };

  if (selectedSeats.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Card className="text-center">
          <h2 className="text-xl font-bold text-primary-dark">
            No seats selected
          </h2>

          <p className="mt-2 text-muted">
            Please select your seats before entering passenger details.
          </p>

          <div className="mt-6">
            <Button
              onClick={() =>
                navigate(
                  `/bus/${id}/seats?journeyDate=${encodeURIComponent(
                    urlJourneyDate,
                  )}`,
                )
              }
            >
              Select Seats
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <Badge variant="primary">Passenger details</Badge>

          <h1 className="mt-4 text-3xl font-bold text-primary-dark md:text-4xl">
            Tell us about the passenger
          </h1>

          <p className="mt-2 text-muted">
            Enter the details required to complete your booking.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Passenger Form */}
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound size={22} />
              </div>

              <div>
                <h2 className="font-bold text-primary-dark">Passenger 1</h2>

                <p className="text-sm text-muted">
                  Seat {selectedSeats.join(", ")}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label htmlFor="name">Full name</Label>

                <Input
                  id="name"
                  value={passenger.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  placeholder="Enter passenger name"
                />
              </div>

              <div>
                <Label htmlFor="age">Age</Label>

                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={passenger.age}
                  onChange={(event) => handleChange("age", event.target.value)}
                  placeholder="Enter age"
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>

                <select
                  id="gender"
                  value={passenger.gender}
                  onChange={(event) =>
                    handleChange("gender", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-surface px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="phone">Phone number</Label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <Input
                    id="phone"
                    type="tel"
                    value={passenger.phone}
                    onChange={(event) =>
                      handleChange("phone", event.target.value)
                    }
                    placeholder="Enter phone number"
                    className="pl-11"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <Input
                    id="email"
                    type="email"
                    value={passenger.email}
                    onChange={(event) =>
                      handleChange("email", event.target.value)
                    }
                    placeholder="Enter email address"
                    className="pl-11"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Booking Summary */}
          <Card className="h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-primary-dark">
              Booking summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Bus</span>

                <span className="font-semibold text-primary-dark">
                  {busOperator}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Route</span>

                <span className="font-semibold text-primary-dark">
                  {source} → {destination}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Journey date</span>

                <span className="font-semibold text-primary-dark">
                  {urlJourneyDate}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Seats</span>

                <span className="font-semibold text-primary-dark">
                  {selectedSeats.join(", ")}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-muted">Seat fare</span>

                  <span className="font-semibold text-primary-dark">
                    ₹{totalAmount}
                  </span>
                </div>

                <div className="mt-3 flex justify-between">
                  <span className="text-muted">Convenience fee</span>

                  <span className="font-semibold text-primary-dark">
                    ₹{convenienceFee}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-primary-dark">Total</span>

                  <span className="text-xl font-bold text-primary">
                    ₹{finalTotal}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <Button disabled={!isFormValid} onClick={handleContinue}>
                Continue to Payment
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default PassengerDetailsPage;
