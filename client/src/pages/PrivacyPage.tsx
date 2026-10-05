import { Database, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

function PrivacyPage() {
  return (
    <main className="min-h-[calc(100vh-160px)] bg-background">
      <section className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}

        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
            <ShieldCheck size={28} />
          </div>

          <p className="mt-5 text-sm font-semibold text-primary">
            BUSFLOW PRIVACY
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary-dark md:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-muted">
            Last updated: September 2026
          </p>
        </div>

        {/* Introduction */}

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm leading-7 text-muted">
            At BusFlow, we respect your privacy and aim to keep your personal
            information secure. This Privacy Policy explains what information
            may be collected when you use the BusFlow platform and how that
            information may be used.
          </p>
        </div>

        {/* Sections */}

        <div className="mt-6 space-y-5">
          {/* Information */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound size={19} />
              </div>

              <h2 className="text-lg font-bold text-primary-dark">
                Information we collect
              </h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-muted">
              When you use BusFlow, we may collect information required to
              provide booking and account services, such as your name, email
              address, phone number, passenger details, journey information, and
              booking information.
            </p>
          </section>

          {/* Usage */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Database size={19} />
              </div>

              <h2 className="text-lg font-bold text-primary-dark">
                How information is used
              </h2>
            </div>

            <ul className="mt-4 space-y-2.5 text-sm leading-6 text-muted">
              <li>• To create and manage your account.</li>
              <li>• To process bus bookings and tickets.</li>
              <li>• To provide customer support.</li>
              <li>• To improve the BusFlow user experience.</li>
              <li>• To provide relevant travel assistance.</li>
            </ul>
          </section>

          {/* Security */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LockKeyhole size={19} />
              </div>

              <h2 className="text-lg font-bold text-primary-dark">
                Data security
              </h2>
            </div>

            <p className="mt-4 text-sm leading-7 text-muted">
              BusFlow is designed with security in mind. Authentication,
              protected APIs, and secure data-handling practices are used to
              help protect account and booking information.
            </p>
          </section>

          {/* Third parties */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-lg font-bold text-primary-dark">
              Third-party services
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted">
              BusFlow may use third-party services for infrastructure, payments,
              analytics, or other platform functionality. Those services may
              process information according to their own privacy policies.
            </p>
          </section>

          {/* Changes */}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-lg font-bold text-primary-dark">
              Changes to this policy
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted">
              This Privacy Policy may be updated as the BusFlow platform
              evolves. Any future changes should be reflected on this page.
            </p>
          </section>
        </div>

        {/* CTA */}

        <div className="mt-8 rounded-2xl bg-primary-dark p-7 text-center text-white">
          <h2 className="text-lg font-bold">Have a privacy question?</h2>

          <p className="mt-2 text-sm text-slate-300">
            Our support team is available to help.
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

export default PrivacyPage;
