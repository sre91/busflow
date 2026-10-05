import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

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

  const formattedJourneyDate = urlJourneyDate
    ? new Date(`${urlJourneyDate}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  if (selectedSeats.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 py-10">
          <Card className="w-full max-w-md border border-slate-200 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UserRound size={25} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-primary-dark">
              No seats selected
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted">
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
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        {/* Header */}

        <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm md:p-7">
          <Badge variant="primary">
            <span className="flex items-center gap-1.5">
              <UserRound size={14} />
              Passenger details
            </span>
          </Badge>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-dark md:text-4xl">
            Passenger information
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Enter the passenger details required to complete your booking.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Passenger Form */}

          <Card className="border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound size={22} />
              </div>

              <div>
                <h2 className="font-bold text-primary-dark">Passenger 1</h2>

                <p className="text-sm text-muted">
                  {selectedSeats.length}{" "}
                  {selectedSeats.length === 1 ? "seat" : "seats"} selected
                </p>
              </div>
            </div>

            {/* Selected seats */}

            <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl bg-background p-4">
              <span className="mr-1 text-sm font-medium text-muted">
                Selected seats:
              </span>

              {selectedSeats.map((seat) => (
                <Badge key={seat}>{seat}</Badge>
              ))}
            </div>

            {/* Form */}

            <div className="mt-8">
              <div className="mb-5">
                <h3 className="font-semibold text-primary-dark">
                  Personal details
                </h3>

                <p className="mt-1 text-sm text-muted">
                  Make sure the information matches the passenger's booking
                  details.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Name */}

                <div className="md:col-span-2">
                  <Label htmlFor="name">Full name</Label>

                  <Input
                    id="name"
                    value={passenger.name}
                    onChange={(event) =>
                      handleChange("name", event.target.value)
                    }
                    placeholder="Enter passenger name"
                  />
                </div>

                {/* Age */}

                <div>
                  <Label htmlFor="age">Age</Label>

                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="120"
                    value={passenger.age}
                    onChange={(event) =>
                      handleChange("age", event.target.value)
                    }
                    placeholder="Enter age"
                  />
                </div>

                {/* Gender */}

                <div>
                  <Label htmlFor="gender">Gender</Label>

                  <select
                    id="gender"
                    value={passenger.gender}
                    onChange={(event) =>
                      handleChange("gender", event.target.value)
                    }
                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-surface px-4 py-3 text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select gender</option>

                    <option value="male">Male</option>

                    <option value="female">Female</option>

                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Phone */}

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

                {/* Email */}

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
            </div>

            {/* Information */}

            <div className="mt-7 flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/5 p-4">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-primary"
              />

              <p className="text-sm leading-relaxed text-muted">
                Your passenger information is used to complete the booking and
                provide your ticket details.
              </p>
            </div>
          </Card>

          {/* Booking Summary */}

          <Card className="h-fit border border-slate-200 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin size={18} />
              </div>

              <h2 className="text-xl font-bold text-primary-dark">
                Booking summary
              </h2>
            </div>

            <div className="mt-6 space-y-5 text-sm">
              {/* Bus */}

              <div className="flex items-start justify-between gap-4">
                <span className="text-muted">Bus</span>

                <span className="max-w-[180px] text-right font-semibold text-primary-dark">
                  {busOperator}
                </span>
              </div>

              {/* Route */}

              <div className="flex items-start justify-between gap-4">
                <span className="text-muted">Route</span>

                <span className="max-w-[180px] text-right font-semibold text-primary-dark">
                  {source}
                  <span className="mx-1 text-primary">→</span>
                  {destination}
                </span>
              </div>

              {/* Date */}

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-muted">
                  <CalendarDays size={15} />
                  Journey date
                </span>

                <span className="text-right font-semibold text-primary-dark">
                  {formattedJourneyDate}
                </span>
              </div>

              {/* Seats */}

              <div className="flex items-start justify-between gap-4">
                <span className="text-muted">Seats</span>

                <div className="flex max-w-[180px] flex-wrap justify-end gap-1.5">
                  {selectedSeats.map((seat) => (
                    <Badge key={seat}>{seat}</Badge>
                  ))}
                </div>
              </div>

              {/* Fare */}

              <div className="border-t border-slate-200 pt-5">
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

              {/* Total */}

              <div className="border-t border-slate-200 pt-5">
                <div className="flex items-end justify-between gap-4">
                  <span className="font-semibold text-primary-dark">Total</span>

                  <span className="text-2xl font-bold text-primary">
                    ₹{finalTotal}
                  </span>
                </div>
              </div>
            </div>

            {/* Continue */}

            <div className="mt-7">
              <Button disabled={!isFormValid} onClick={handleContinue}>
                Continue to Payment
              </Button>
            </div>

            <p className="mt-4 text-center text-xs leading-relaxed text-muted">
              Complete the passenger details to continue.
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default PassengerDetailsPage;
