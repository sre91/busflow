import { BusFront } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          {/* Brand */}

          <div className="text-center md:text-left">
            <Link
              to="/"
              className="group flex items-center justify-center gap-2.5 md:justify-start"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition duration-200 group-hover:scale-105">
                <BusFront size={21} strokeWidth={2.2} />
              </div>

              <span className="text-xl font-bold tracking-tight transition group-hover:text-slate-200">
                BusFlow
              </span>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-300">
              Your smarter way to travel by bus.
            </p>
          </div>

          {/* Links */}

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:pt-2"
          >
            <Link
              to="/about"
              className="cursor-pointer text-sm text-slate-300 transition hover:text-white"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="cursor-pointer text-sm text-slate-300 transition hover:text-white"
            >
              Contact
            </Link>

            <Link
              to="/privacy"
              className="cursor-pointer text-sm text-slate-300 transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="cursor-pointer text-sm text-slate-300 transition hover:text-white"
            >
              Terms
            </Link>
          </nav>
        </div>

        {/* Copyright */}

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-white/10 pt-5 text-center sm:flex-row sm:justify-between">
          <p className="text-xs text-slate-400">
            © 2026 BusFlow. Created By sreenath.
          </p>

          <p className="text-xs text-slate-500">
            Travel smarter. Travel better. 🚌
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
