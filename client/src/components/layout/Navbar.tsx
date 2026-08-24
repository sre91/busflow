function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-surface/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚌</span>

          <span className="text-xl font-bold tracking-tight text-primary-dark">
            BusFlow
          </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#" className="font-medium text-primary transition-colors">
            Home
          </a>

          <a
            href="#"
            className="font-medium text-muted transition-colors hover:text-primary"
          >
            Buses
          </a>

          <a
            href="#"
            className="font-medium text-muted transition-colors hover:text-primary"
          >
            My Bookings
          </a>

          <a
            href="#"
            className="font-medium text-muted transition-colors hover:text-primary"
          >
            Chat
          </a>
        </div>

        <button
          type="button"
          className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white transition hover:bg-primary-dark"
        >
          Login
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
