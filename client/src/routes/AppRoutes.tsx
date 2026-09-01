import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import SearchResultsPage from "../pages/SearchResultsPage";
import BusDetailsPage from "../pages/BusDetailsPage";
import SeatSelectionPage from "../pages/SeatSelectionPage";
import PassengerDetailsPage from "../pages/PassengerDetailsPage";
import PaymentPage from "../pages/PaymentPage";
import BookingConfirmationPage from "../pages/BookingConfirmationPage";
import LoginPage from "../pages/LoginPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import BookingDetailsPage from "../pages/BookingDetailsPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/bus/:id" element={<BusDetailsPage />} />
        <Route path="/bus/:id/seats" element={<SeatSelectionPage />} />
        <Route path="/bus/:id/passenger" element={<PassengerDetailsPage />} />
        <Route path="/bus/:id/payment" element={<PaymentPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/booking/:id" element={<BookingDetailsPage />} />
        <Route
          path="/bus/:id/confirmation"
          element={<BookingConfirmationPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
