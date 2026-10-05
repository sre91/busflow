import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  MapPin,
  Smartphone,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { getApiErrorMessage, isSeatConflictError } from "../api/apiError";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";

import { useAppSelector } from "../app/hooks";
import { createBooking } from "../api/bookingApi";

type PaymentMethod = "card" | "upi";

function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const {
    busId,
    busOperator,
    source,
    destination,
    journeyDate,
    selectedSeats,
    totalAmount,
    passenger,
  } = useAppSelector((state) => state.booking);

  const urlJourneyDate = searchParams.get("journeyDate") || journeyDate;

  const convenienceFee = 49;
  const finalTotal = totalAmount + convenienceFee;

  const normalizedCardNumber = cardNumber.replace(/\s/g, "");

  const cardNumberValid = /^\d{16}$/.test(normalizedCardNumber);

  const cardNameValid = cardName.trim().length >= 2;

  const expiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.trim());

  const cvvValid = /^\d{3}$/.test(cvv.trim());

  const isCardValid =
    cardNumberValid && cardNameValid && expiryValid && cvvValid;

  const isUpiValid = /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(upiId.trim());

  const isPaymentValid = paymentMethod === "card" ? isCardValid : isUpiValid;

  const handleLogin = () => {
    const paymentPath = id
      ? `/bus/${id}/payment${
          urlJourneyDate
            ? `?journeyDate=${encodeURIComponent(urlJourneyDate)}`
            : ""
        }`
      : "/";

    navigate("/login", {
      state: {
        returnTo: paymentPath,
      },
    });
  };

  const handlePayment = async () => {
    if (
      !isPaymentValid ||
      !passenger ||
      !busId ||
      !urlJourneyDate ||
      selectedSeats.length === 0
    ) {
      return;
    }

    if (!isAuthenticated) {
      setPaymentError("Please login to finish your booking.");

      return;
    }

    setIsProcessing(true);
    setPaymentError("");

    try {
      const booking = await createBooking({
        busId,

        journeyDate: urlJourneyDate,

        passenger: {
          name: passenger.name,
          age: Number(passenger.age),
          gender: passenger.gender,
          phone: passenger.phone,
          email: passenger.email,
        },

        seats: selectedSeats,

        paymentMethod,
      });

      navigate(`/bus/${id}/confirmation`, {
        state: {
          booking,
        },
      });
    } catch (error) {
      console.error("Booking failed:", error);

      const message = getApiErrorMessage(error);

      setPaymentError(message);

      if (isSeatConflictError(error)) {
        setTimeout(() => {
          navigate(
            `/bus/${id}/seats?journeyDate=${encodeURIComponent(
              urlJourneyDate,
            )}`,
          );
        }, 2000);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedSeats.length === 0 || !passenger || !busId || !urlJourneyDate) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 py-10">
          <Card className="w-full max-w-md border border-slate-200 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CreditCard size={25} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-primary-dark">
              Booking information missing
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              Please select your seats and enter passenger details before making
              payment.
            </p>

            <div className="mt-6">
              <Button
                onClick={() =>
                  navigate(
                    `/bus/${id}/seats?journeyDate=${encodeURIComponent(
                      urlJourneyDate || "",
                    )}`,
                  )
                }
              >
                Start Booking
              </Button>
            </div>
          </Card>
        </section>
      </main>
    );
  }

  const formattedJourneyDate = new Date(
    `${urlJourneyDate}T00:00:00`,
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        {/* Page header */}

        <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm md:p-7">
          <Badge variant="primary">
            <span className="flex items-center gap-1.5">
              <LockKeyhole size={14} />
              Secure payment
            </span>
          </Badge>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-dark md:text-4xl">
            Complete your booking
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            Choose your preferred payment method and complete your booking
            securely.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Payment card */}

          <Card className="border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CreditCard size={22} />
              </div>

              <div>
                <h2 className="font-bold text-primary-dark">Payment method</h2>

                <p className="text-sm text-muted">Select how you want to pay</p>
              </div>
            </div>

            {/* Payment method selection */}

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("card");
                  setPaymentError("");
                }}
                className={`cursor-pointer rounded-2xl border p-5 text-left transition ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-slate-200 hover:border-primary/40 hover:bg-background"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CreditCard size={21} />
                  </div>

                  {paymentMethod === "card" && (
                    <CheckCircle2 size={20} className="text-primary" />
                  )}
                </div>

                <p className="mt-4 font-semibold text-primary-dark">
                  Credit / Debit Card
                </p>

                <p className="mt-1 text-sm text-muted">
                  Visa, Mastercard and more
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("upi");
                  setPaymentError("");
                }}
                className={`cursor-pointer rounded-2xl border p-5 text-left transition ${
                  paymentMethod === "upi"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-slate-200 hover:border-primary/40 hover:bg-background"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Smartphone size={21} />
                  </div>

                  {paymentMethod === "upi" && (
                    <CheckCircle2 size={20} className="text-primary" />
                  )}
                </div>

                <p className="mt-4 font-semibold text-primary-dark">UPI</p>

                <p className="mt-1 text-sm text-muted">Pay using your UPI ID</p>
              </button>
            </div>

            {/* Card form */}

            {paymentMethod === "card" ? (
              <div className="mt-8">
                <div className="mb-5">
                  <h3 className="font-semibold text-primary-dark">
                    Card details
                  </h3>

                  <p className="mt-1 text-sm text-muted">
                    Enter your card information to continue.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="cardNumber">Card number</Label>

                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(event) => setCardNumber(event.target.value)}
                      placeholder="1234 5678 9012 3456"
                      inputMode="numeric"
                    />

                    {cardNumber.length > 0 && !cardNumberValid && (
                      <p className="mt-2 text-sm text-red-500">
                        Enter a valid 16-digit card number.
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cardName">Name on card</Label>

                    <Input
                      id="cardName"
                      value={cardName}
                      onChange={(event) => setCardName(event.target.value)}
                      placeholder="Enter cardholder name"
                    />

                    {cardName.length > 0 && !cardNameValid && (
                      <p className="mt-2 text-sm text-red-500">
                        Enter the cardholder name.
                      </p>
                    )}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="expiry">Expiry date</Label>

                      <Input
                        id="expiry"
                        value={expiry}
                        onChange={(event) => setExpiry(event.target.value)}
                        placeholder="MM/YY"
                        inputMode="numeric"
                        maxLength={5}
                      />

                      {expiry.length > 0 && !expiryValid && (
                        <p className="mt-2 text-sm text-red-500">
                          Use MM/YY format.
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cvv">CVV</Label>

                      <Input
                        id="cvv"
                        type="password"
                        value={cvv}
                        onChange={(event) => setCvv(event.target.value)}
                        placeholder="•••"
                        inputMode="numeric"
                        maxLength={3}
                      />

                      {cvv.length > 0 && !cvvValid && (
                        <p className="mt-2 text-sm text-red-500">
                          CVV must contain 3 digits.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* UPI form */

              <div className="mt-8">
                <div className="mb-5">
                  <h3 className="font-semibold text-primary-dark">
                    UPI details
                  </h3>

                  <p className="mt-1 text-sm text-muted">
                    Enter the UPI ID linked to your bank account.
                  </p>
                </div>

                <Label htmlFor="upiId">UPI ID</Label>

                <Input
                  id="upiId"
                  value={upiId}
                  onChange={(event) => setUpiId(event.target.value)}
                  placeholder="example@upi"
                />

                {upiId.length > 0 && !isUpiValid && (
                  <p className="mt-2 text-sm text-red-500">
                    Enter a valid UPI ID.
                  </p>
                )}
              </div>
            )}

            {/* Security note */}

            <div className="mt-8 flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/5 p-4">
              <LockKeyhole size={19} className="mt-0.5 shrink-0 text-success" />

              <div>
                <p className="text-sm font-semibold text-primary-dark">
                  Secure payment
                </p>

                <p className="mt-1 text-sm leading-relaxed text-muted">
                  Your payment information is securely handled during the
                  booking process.
                </p>
              </div>
            </div>

            {/* Authentication / API error */}

            {paymentError && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm font-medium leading-relaxed text-red-600">
                  {paymentError}
                </p>

                {!isAuthenticated && (
                  <div className="mt-3">
                    <Button onClick={handleLogin}>Login to Continue</Button>
                  </div>
                )}
              </div>
            )}

            {/* Payment button */}

            <div className="mt-7">
              <Button
                disabled={!isPaymentValid || isProcessing}
                onClick={handlePayment}
              >
                {isProcessing ? "Processing..." : `Pay ₹${finalTotal}`}
              </Button>
            </div>
          </Card>

          {/* Booking summary */}

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
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted">Bus</span>

                <span className="max-w-[180px] text-right font-semibold text-primary-dark">
                  {busOperator}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-muted">Route</span>

                <span className="max-w-[180px] text-right font-semibold text-primary-dark">
                  {source}
                  <span className="mx-1 text-primary">→</span>
                  {destination}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-muted">
                  <CalendarDays size={15} />
                  Journey date
                </span>

                <span className="text-right font-semibold text-primary-dark">
                  {formattedJourneyDate}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-muted">Seats</span>

                <div className="flex max-w-[180px] flex-wrap justify-end gap-1.5">
                  {selectedSeats.map((seat) => (
                    <Badge key={seat}>{seat}</Badge>
                  ))}
                </div>
              </div>

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

              <div className="border-t border-slate-200 pt-5">
                <div className="flex items-end justify-between gap-4">
                  <span className="font-semibold text-primary-dark">Total</span>

                  <span className="text-2xl font-bold text-primary">
                    ₹{finalTotal}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-background p-3">
              <CheckCircle2 size={16} className="shrink-0 text-success" />

              <p className="text-xs leading-relaxed text-muted">
                Your seats are reserved for this booking flow.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default PaymentPage;
