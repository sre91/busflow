function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚌</span>

              <span className="text-xl font-bold">BusFlow</span>
            </div>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">
              Your smarter way to discover, book, and manage bus journeys.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Company</h3>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>About</p>
              <p>Contact</p>
              <p>Careers</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Explore</h3>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Search buses</p>
              <p>Popular routes</p>
              <p>My bookings</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Support</h3>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Help center</p>
              <p>Cancellation</p>
              <p>Terms & privacy</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-400">
          © 2026 BusFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
