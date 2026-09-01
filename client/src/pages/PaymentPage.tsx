import { useState } from "react";
import { CreditCard, LockKeyhole, Smartphone } from "lucide-react";
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

  /*
   * Card validation
   */

  const normalizedCardNumber = cardNumber.replace(/\s/g, "");

  const cardNumberValid = /^\d{16}$/.test(normalizedCardNumber);

  const cardNameValid = cardName.trim().length >= 2;

  const expiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.trim());

  const cvvValid = /^\d{3}$/.test(cvv.trim());

  const isCardValid =
    cardNumberValid && cardNameValid && expiryValid && cvvValid;

  /*
   * UPI validation
   */

  const isUpiValid = /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(upiId.trim());

  const isPaymentValid = paymentMethod === "card" ? isCardValid : isUpiValid;

  /*
   * Payment / booking
   */

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

      /*
       * If another user booked one of our
       * selected seats, return to the seat
       * selection page after showing the
       * conflict message.
       */

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

  /*
   * Missing booking information
   */

  if (selectedSeats.length === 0 || !passenger || !busId || !urlJourneyDate) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Card className="text-center">
          <h2 className="text-xl font-bold text-primary-dark">
            Booking information missing
          </h2>

          <p className="mt-2 text-muted">
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
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <Badge variant="primary">Secure payment</Badge>

          <h1 className="mt-4 text-3xl font-bold text-primary-dark md:text-4xl">
            Complete your booking
          </h1>

          <p className="mt-2 text-muted">
            Choose your payment method and complete the transaction.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Payment */}

          <Card>
            <h2 className="text-xl font-bold text-primary-dark">
              Payment method
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Card */}

              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("card");
                  setPaymentError("");
                }}
                className={`rounded-2xl border p-5 text-left transition ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 hover:border-primary/40"
                }`}
              >
                <CreditCard className="text-primary" size={24} />

                <p className="mt-3 font-semibold text-primary-dark">
                  Credit / Debit Card
                </p>

                <p className="mt-1 text-sm text-muted">
                  Visa, Mastercard and more
                </p>
              </button>

              {/* UPI */}

              <button
                type="button"
                onClick={() => {
                  setPaymentMethod("upi");
                  setPaymentError("");
                }}
                className={`rounded-2xl border p-5 text-left transition ${
                  paymentMethod === "upi"
                    ? "border-primary bg-primary/5"
                    : "border-slate-200 hover:border-primary/40"
                }`}
              >
                <Smartphone className="text-primary" size={24} />

                <p className="mt-3 font-semibold text-primary-dark">UPI</p>

                <p className="mt-1 text-sm text-muted">Pay using your UPI ID</p>
              </button>
            </div>

            {/* Card form */}

            {paymentMethod === "card" ? (
              <div className="mt-8 space-y-5">
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
            ) : (
              /* UPI form */

              <div className="mt-8">
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

            {/* Security */}

            <div className="mt-8 flex items-center gap-3 rounded-xl bg-background p-4">
              <LockKeyhole size={20} className="text-success" />

              <p className="text-sm text-muted">
                Your payment information is securely handled.
              </p>
            </div>

            {/* API error */}

            {paymentError && (
              <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                {paymentError}

                {isSeatConflictError(paymentError) && null}
              </div>
            )}

            <div className="mt-7">
              <Button
                disabled={!isPaymentValid || isProcessing}
                onClick={handlePayment}
              >
                {isProcessing ? "Processing..." : `Pay ₹${finalTotal}`}
              </Button>
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
                  {new Date(urlJourneyDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted">Seats</span>

                <span className="text-right font-semibold text-primary-dark">
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
          </Card>
        </div>
      </section>
    </main>
  );
}

export default PaymentPage;
