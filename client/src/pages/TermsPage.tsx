import {
  AlertCircle,
  BusFront,
  CheckCircle2,
  FileText,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

function TermsPage() {
  return (
    <main className="min-h-[calc(100vh-160px)] bg-background">
      <section className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}

        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
            <FileText size={28} />
          </div>

          <p className="mt-5 text-sm font-semibold text-primary">
            BUSFLOW TERMS
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary-dark md:text-4xl">
            Terms &amp; Conditions
          </h1>
        </div>

        {/* Introduction */}

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm leading-7 text-muted">
            By using BusFlow, you agree to use the platform responsibly and
            follow the terms described below. These terms are intended to
            explain the general rules for using the BusFlow booking platform.
          </p>
        </div>

        {/* Sections */}

        <div className="mt-6 space-y-5">
          {/* Account */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserCheck size={19} />
              </div>

              <h2 className="text-lg font-bold text-primary-dark">
                Account responsibility
              </h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-muted">
              Users are responsible for providing accurate information when
              creating an account and making a booking. You should keep your
              login credentials secure and should not knowingly share your
              account with another person.
            </p>
          </section>

          {/* Booking */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BusFront size={19} />
              </div>

              <h2 className="text-lg font-bold text-primary-dark">
                Bus bookings
              </h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-muted">
              Booking information should be reviewed carefully before completing
              a reservation. This includes the journey date, boarding and
              destination locations, passenger information, selected seats, and
              payment details.
            </p>
          </section>

          {/* Payments */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 size={19} />
              </div>

              <h2 className="text-lg font-bold text-primary-dark">Payments</h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-muted">
              Payment information provided during a booking should be accurate.
              A booking may only be considered confirmed after the required
              booking and payment processes have been successfully completed.
            </p>
          </section>

          {/* Cancellation */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-lg font-bold text-primary-dark">
              Cancellation
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted">
              Cancellation availability and any applicable refund conditions
              depend on the booking rules implemented by the platform and the
              relevant bus service. Users should review booking information
              before cancelling.
            </p>
          </section>

          {/* Acceptable use */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <AlertCircle size={19} />
              </div>

              <h2 className="text-lg font-bold text-primary-dark">
                Acceptable use
              </h2>
            </div>

            <ul className="mt-4 space-y-2.5 text-sm leading-6 text-muted">
              <li>• Do not misuse the BusFlow platform.</li>
              <li>• Do not attempt to access another user&apos;s account.</li>
              <li>• Do not provide intentionally false booking information.</li>
              <li>
                • Do not interfere with the normal operation of the platform.
              </li>
            </ul>
          </section>

          {/* Service availability */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-lg font-bold text-primary-dark">
              Service availability
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted">
              BusFlow may occasionally experience maintenance, technical issues,
              or service interruptions. Features and availability may change as
              the platform is updated and improved.
            </p>
          </section>

          {/* Changes */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-lg font-bold text-primary-dark">
              Changes to these terms
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted">
              These terms may be updated as BusFlow evolves. Continued use of
              the platform after changes are published may constitute acceptance
              of the updated terms.
            </p>
          </section>
        </div>

        {/* CTA */}

        <div className="mt-8 rounded-2xl bg-primary-dark p-7 text-center text-white">
          <h2 className="text-lg font-bold">Need clarification?</h2>

          <p className="mt-2 text-sm text-slate-300">
            Contact the BusFlow support team if you have questions.
          </p>

          <Link
            to="/contact"
            className="mt-5 inline-flex cursor-pointer items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-light"
          >
            Contact BusFlow
          </Link>
        </div>
      </section>
    </main>
  );
}

export default TermsPage;
