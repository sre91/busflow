import { BusFront, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-160px)] bg-background">
      <section className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}

        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
            <BusFront size={28} />
          </div>

          <p className="mt-5 text-sm font-semibold text-primary">
            ABOUT BUSFLOW
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary-dark md:text-4xl">
            Travel smarter with BusFlow
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">
            BusFlow is a modern bus ticket booking platform designed to make
            finding, comparing, and booking bus journeys simple and convenient.
          </p>
        </div>

        {/* Main content */}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles size={20} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-primary-dark">
              Smarter travel
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              BusFlow combines a simple booking experience with intelligent
              travel assistance to help you plan your journey with confidence.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CheckCircle2 size={20} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-primary-dark">
              Simple booking
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Search buses, choose your seats, enter passenger details, and
              complete your booking through a clean and easy-to-use experience.
            </p>
          </div>
        </div>

        {/* CTA */}

        <div className="mt-8 rounded-2xl bg-primary-dark p-8 text-center text-white">
          <h2 className="text-xl font-bold">Ready for your next journey?</h2>

          <p className="mt-2 text-sm text-slate-300">
            Find your bus and start planning your trip today.
          </p>

          <Link
            to="/"
            className="mt-5 inline-flex cursor-pointer items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light"
          >
            Explore buses
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
