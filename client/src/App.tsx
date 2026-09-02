import { useEffect } from "react";

import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
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
    <div className="min-h-screen bg-background">
      <Navbar />

      <AppRoutes />

      <Footer />
    </div>
  );
}

export default App;
