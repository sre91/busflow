import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: false,

  // Automatic reconnection
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

socket.on("connect", () => {
  console.log("🔌 Connected to BusFlow Socket.IO:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("❌ BusFlow Socket.IO connection error:", error.message);
});

socket.on("reconnect_attempt", (attempt) => {
  console.log(`🔄 Socket reconnection attempt: ${attempt}`);
});

socket.on("reconnect", (attempt) => {
  console.log(`✅ Socket reconnected after ${attempt} attempt(s)`);
});

socket.on("reconnect_failed", () => {
  console.error("❌ BusFlow Socket.IO reconnection failed");
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Disconnected from BusFlow Socket.IO:", reason);
});

export default socket;
