import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import ScrollToTop from "./components/layout/ScrollToTop";
import AIAssistant from "./components/ai/AIAssistant";
import AppRoutes from "./routes/AppRoutes";
import socket from "./socket";

function App() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <div className="min-h-screen bg-background">
        <Navbar />
        <AppRoutes />
        <Footer />
        <AIAssistant />
      </div>
    </BrowserRouter>
  );
}

export default App;
