import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import SearchResultsPage from "../pages/SearchResultsPage";
import BusDetailsPage from "../pages/BusDetailsPage";
import SeatSelectionPage from "../pages/SeatSelectionPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/bus/:id" element={<BusDetailsPage />} />
        <Route path="/bus/:id/seats" element={<SeatSelectionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
