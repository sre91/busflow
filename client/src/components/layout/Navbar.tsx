import { BusFront, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import NotificationBell from "../notifications/NotificationBell";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { logout } from "../../features/auth/authSlice";

function Navbar() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-surface/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Logo */}

        <Link
          to="/"
          onClick={closeMenu}
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition group-hover:scale-105">
            <BusFront size={21} strokeWidth={2.2} />
          </div>

          <span className="text-xl font-bold tracking-tight text-primary-dark transition group-hover:text-primary">
            BusFlow
          </span>
        </Link>

        {/* Desktop Navigation */}

        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="font-medium text-primary transition-colors hover:text-primary-dark"
          >
            Home
          </Link>

          <Link
            to="/search"
            className="font-medium text-muted transition-colors hover:text-primary"
          >
            Buses
          </Link>

          {isAuthenticated && (
            <Link
              to="/bookings"
              className="font-medium text-muted transition-colors hover:text-primary"
            >
              My Bookings
            </Link>
          )}

          <Link
            to="/about"
            className="font-medium text-muted transition-colors hover:text-primary"
          >
            About
          </Link>
        </div>

        {/* Right Side */}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Bell */}

          {isAuthenticated && <NotificationBell />}

          {/* Desktop Authentication */}

          <div className="hidden items-center gap-3 sm:flex">
            {isAuthenticated ? (
              <>
                <span className="hidden text-sm font-medium text-primary-dark lg:block">
                  Hi, {user?.name}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer rounded-xl bg-primary px-5 py-2.5 font-semibold text-white transition hover:bg-primary-dark"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="cursor-pointer rounded-xl bg-primary px-5 py-2.5 font-semibold text-white transition hover:bg-primary-dark"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-primary-dark transition hover:bg-slate-50 md:hidden"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-surface md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            <Link
              to="/"
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 font-medium text-primary transition hover:bg-slate-50"
            >
              Home
            </Link>

            <Link
              to="/search"
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 font-medium text-muted transition hover:bg-slate-50 hover:text-primary"
            >
              Buses
            </Link>

            {isAuthenticated && (
              <Link
                to="/bookings"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3 font-medium text-muted transition hover:bg-slate-50 hover:text-primary"
              >
                My Bookings
              </Link>
            )}

            <Link
              to="/about"
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 font-medium text-muted transition hover:bg-slate-50 hover:text-primary"
            >
              About
            </Link>

            {/* Mobile Authentication */}

            <div className="border-t border-slate-100 pt-3">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm font-medium text-primary-dark">
                    Hi, {user?.name}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 w-full cursor-pointer rounded-xl bg-primary px-4 py-3 text-left font-semibold text-white transition hover:bg-primary-dark"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary-dark"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
