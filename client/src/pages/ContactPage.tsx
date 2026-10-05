import { Clock3, Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

function ContactPage() {
  return (
    <main className="min-h-[calc(100vh-160px)] bg-background">
      <section className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}

        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
            <MessageCircle size={28} />
          </div>

          <p className="mt-5 text-sm font-semibold text-primary">
            CONTACT BUSFLOW
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary-dark md:text-4xl">
            We&apos;re here to help
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">
            Have a question about your journey, booking, or BusFlow? Reach out
            to our support team.
          </p>
        </div>

        {/* Contact cards */}

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {/* Email */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail size={21} />
            </div>

            <h2 className="mt-4 text-base font-bold text-primary-dark">
              Email
            </h2>

            <p className="mt-2 text-sm text-muted">support@busflow.com</p>
          </div>

          {/* Phone */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Phone size={21} />
            </div>

            <h2 className="mt-4 text-base font-bold text-primary-dark">
              Phone
            </h2>

            <p className="mt-2 text-sm text-muted">+91 1800 123 4567</p>
          </div>

          {/* Support hours */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Clock3 size={21} />
            </div>

            <h2 className="mt-4 text-base font-bold text-primary-dark">
              Support hours
            </h2>

            <p className="mt-2 text-sm text-muted">Available 24/7</p>
          </div>
        </div>

        {/* Support message */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-primary-dark">
              Need help with a booking?
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              You can also use the BusFlow Support Chat available on the
              homepage for quick assistance with your journey.
            </p>

            <Link
              to="/"
              className="mt-5 inline-flex cursor-pointer items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactPage;
