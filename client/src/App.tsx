import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HomePage />
      <Footer />
    </div>
  );
}

export default App;
