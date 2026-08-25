import { useState } from "react";
import { CreditCard, LockKeyhole, Smartphone } from "lucide-react";

import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import { useNavigate, useParams } from "react-router-dom";

type PaymentMethod = "card" | "upi";

function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const isCardValid =
    cardNumber.trim() !== "" &&
    cardName.trim() !== "" &&
    expiry.trim() !== "" &&
    cvv.trim() !== "";

  const isUpiValid = upiId.trim() !== "";

  const isPaymentValid = paymentMethod === "card" ? isCardValid : isUpiValid;

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
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
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

              <button
                type="button"
                onClick={() => setPaymentMethod("upi")}
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

            {paymentMethod === "card" ? (
              <div className="mt-8 space-y-5">
                <div>
                  <Label htmlFor="cardNumber">Card number</Label>

                  <Input
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(event) => setCardNumber(event.target.value)}
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div>
                  <Label htmlFor="cardName">Name on card</Label>

                  <Input
                    id="cardName"
                    value={cardName}
                    onChange={(event) => setCardName(event.target.value)}
                    placeholder="Enter cardholder name"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="expiry">Expiry date</Label>

                    <Input
                      id="expiry"
                      value={expiry}
                      onChange={(event) => setExpiry(event.target.value)}
                      placeholder="MM / YY"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cvv">CVV</Label>

                    <Input
                      id="cvv"
                      type="password"
                      value={cvv}
                      onChange={(event) => setCvv(event.target.value)}
                      placeholder="•••"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                <Label htmlFor="upiId">UPI ID</Label>

                <Input
                  id="upiId"
                  value={upiId}
                  onChange={(event) => setUpiId(event.target.value)}
                  placeholder="example@upi"
                />
              </div>
            )}

            <div className="mt-8 flex items-center gap-3 rounded-xl bg-background p-4">
              <LockKeyhole size={20} className="text-success" />

              <p className="text-sm text-muted">
                Your payment information is securely handled.
              </p>
            </div>

            <div className="mt-7">
              <Button
                disabled={!isPaymentValid}
                onClick={() => navigate(`/bus/${id}/confirmation`)}
              >
                Pay ₹948
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
                  BlueLine Travels
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Route</span>

                <span className="font-semibold text-primary-dark">
                  Chennai → Bangalore
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted">Seat</span>

                <span className="font-semibold text-primary-dark">1A</span>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-muted">Seat fare</span>

                  <span className="font-semibold text-primary-dark">₹899</span>
                </div>

                <div className="mt-3 flex justify-between">
                  <span className="text-muted">Convenience fee</span>

                  <span className="font-semibold text-primary-dark">₹49</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-primary-dark">Total</span>

                  <span className="text-xl font-bold text-primary">₹948</span>
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
