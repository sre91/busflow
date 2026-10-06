import { Server } from "socket.io";

import env from "../config/env.js";

import Conversation from "../models/Conversation.js";

import {
  createMessage,
  markConversationMessagesAsRead,
} from "../services/chatService.js";

import { createNotification } from "../services/notificationService.js";

let io: Server;

const messageRateMap = new Map<
  string,
  {
    count: number;
    windowStart: number;
  }
>();

const MESSAGE_LIMIT = 30;

const MESSAGE_WINDOW = 60 * 1000;

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // Join user room

    socket.on("joinUser", (userId: string) => {
      if (!userId || typeof userId !== "string") {
        return;
      }

      const room = `user:${userId}`;

      socket.join(room);

      console.log(`👤 User ${userId} joined room ${room}`);
    });

    // Join bus room

    socket.on("joinBusRoom", (busId: string) => {
      if (!busId || typeof busId !== "string") {
        return;
      }

      const room = `bus:${busId}`;

      socket.join(room);

      console.log(`🚌 Socket ${socket.id} joined ${room}`);
    });

    // Leave bus room

    socket.on("leaveBusRoom", (busId: string) => {
      if (!busId || typeof busId !== "string") {
        return;
      }

      const room = `bus:${busId}`;

      socket.leave(room);

      console.log(`🚌 Socket ${socket.id} left ${room}`);
    });

    // Join chat room

    socket.on("joinChat", async (data) => {
      try {
        const { conversationId, userId } = data || {};

        if (typeof conversationId !== "string" || typeof userId !== "string") {
          socket.emit("chatError", {
            message: "Invalid chat data.",
          });

          return;
        }

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
          socket.emit("chatError", {
            message: "Conversation not found.",
          });

          return;
        }

        const isParticipant = conversation.participants.some(
          (participant) => participant.toString() === userId,
        );

        if (!isParticipant) {
          socket.emit("chatError", {
            message: "You are not a participant in this conversation.",
          });

          return;
        }

        const room = `chat:${conversationId}`;

        socket.join(room);

        console.log(`💬 User ${userId} joined chat room ${room}`);
      } catch (error) {
        console.error("❌ Join chat error:", error);

        socket.emit("chatError", {
          message: "Unable to join chat.",
        });
      }
    });

    // Leave chat room

    socket.on("leaveChat", (conversationId: string) => {
      if (!conversationId || typeof conversationId !== "string") {
        return;
      }

      const room = `chat:${conversationId}`;

      socket.leave(room);

      console.log(`💬 Socket ${socket.id} left ${room}`);
    });

    // Send chat message

    socket.on("sendMessage", async (data) => {
      try {
        const { conversationId, senderId, content } = data || {};

        if (
          typeof conversationId !== "string" ||
          typeof senderId !== "string" ||
          typeof content !== "string"
        ) {
          socket.emit("chatError", {
            message: "Invalid message data.",
          });

          return;
        }

        // Rate limiting

        const now = Date.now();

        const existing = messageRateMap.get(senderId);

        if (!existing || now - existing.windowStart >= MESSAGE_WINDOW) {
          messageRateMap.set(senderId, {
            count: 1,
            windowStart: now,
          });
        } else {
          existing.count += 1;

          if (existing.count > MESSAGE_LIMIT) {
            socket.emit("chatError", {
              message: "Too many messages. Please slow down.",
            });

            return;
          }
        }

        const message = await createMessage(conversationId, senderId, content);

        const populatedMessage = await message.populate(
          "senderId",
          "name email",
        );

        const sender = populatedMessage.senderId as unknown as {
          _id: string;
          name: string;
          email: string;
        };

        const room = `chat:${conversationId}`;

        io.to(room).emit("receiveMessage", populatedMessage);

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
          return;
        }

        for (const participantId of conversation.participants) {
          const recipientId = participantId.toString();

          if (recipientId === senderId) {
            continue;
          }

          const notification = await createNotification(
            recipientId,
            "message",
            "New message",
            `${sender.name}: ${content}`,
            conversationId,
          );

          // Emit notification

          io.to(`user:${recipientId}`).emit("newNotification", notification);
        }
      } catch (error) {
        console.error("❌ Send message error:", error);

        socket.emit("chatError", {
          message:
            error instanceof Error ? error.message : "Unable to send message.",
        });
      }
    });

    // Mark messages as read

    socket.on("markMessagesAsRead", async (data) => {
      try {
        const { conversationId, userId } = data || {};

        if (typeof conversationId !== "string" || typeof userId !== "string") {
          socket.emit("chatError", {
            message: "Invalid read-status data.",
          });

          return;
        }

        const modifiedCount = await markConversationMessagesAsRead(
          conversationId,
          userId,
        );

        socket.emit("messagesMarkedAsRead", {
          conversationId,
          modifiedCount,
        });
      } catch (error) {
        console.error("❌ Mark messages as read error:", error);

        socket.emit("chatError", {
          message:
            error instanceof Error
              ? error.message
              : "Unable to mark messages as read.",
        });
      }
    });

    // Test Socket.IO connection

    socket.on("testEvent", (data) => {
      console.log("🧪 Test event received:", data);

      socket.emit("testResponse", {
        message: "BusFlow Socket.IO is working!",
        data,
      });
    });

    // Disconnect

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", socket.id, reason);
    });
  });

  console.log("🚀 BusFlow Socket.IO initialized");

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
};
