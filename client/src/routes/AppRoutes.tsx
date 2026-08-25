import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import SearchResultsPage from "../pages/SearchResultsPage";
import BusDetailsPage from "../pages/BusDetailsPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/search" element={<SearchResultsPage />} />

        <Route path="/bus/:id" element={<BusDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
