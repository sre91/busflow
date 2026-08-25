import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <AppRoutes />

      <Footer />
    </div>
  );
}

export default App;
