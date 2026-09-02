import { Server, Socket } from "socket.io";

let io: Server;

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};

const initializeSocket = (socketServer: Server) => {
  io = socketServer;

  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join a bus-specific room
    socket.on("joinBusRoom", (busId: string) => {
      if (!busId) {
        return;
      }

      const roomName = `bus:${busId}`;

      socket.join(roomName);

      console.log(`🚌 Socket ${socket.id} joined room ${roomName}`);
    });

    // Leave a bus-specific room
    socket.on("leaveBusRoom", (busId: string) => {
      if (!busId) {
        return;
      }

      const roomName = `bus:${busId}`;

      socket.leave(roomName);

      console.log(`🚌 Socket ${socket.id} left room ${roomName}`);
    });

    // Test event
    socket.on("testBusUpdate", (busId: string) => {
      if (!busId) {
        return;
      }

      const roomName = `bus:${busId}`;

      io.to(roomName).emit("busUpdate", {
        message: "Bus update received",
        busId,
      });
    });

    // Socket disconnected
    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

export default initializeSocket;
