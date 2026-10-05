import mongoose from "mongoose";

import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// Find or create conversation

export const findOrCreateConversation = async (
  userId: string,
  otherUserId: string,
) => {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(otherUserId)
  ) {
    throw new Error("Invalid user ID");
  }

  if (userId === otherUserId) {
    throw new Error("Users cannot chat with themselves");
  }

  let conversation = await Conversation.findOne({
    participants: {
      $all: [
        new mongoose.Types.ObjectId(userId),

        new mongoose.Types.ObjectId(otherUserId),
      ],
    },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [
        new mongoose.Types.ObjectId(userId),

        new mongoose.Types.ObjectId(otherUserId),
      ],
    });
  }

  return conversation;
};

export const getUserConversations = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const conversations = await Conversation.find({
    participants: new mongoose.Types.ObjectId(userId),
  })
    .populate("participants", "name email role")
    .sort({
      updatedAt: -1,
    });

  return conversations;
};

// Get conversation messages

export const getConversationMessages = async (
  conversationId: string,
  page = 1,
  limit = 30,
) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new Error("Invalid conversation ID");
  }

  const safePage = Math.max(Number(page) || 1, 1);

  const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), 50);

  const skip = (safePage - 1) * safeLimit;

  const conversationObjectId = new mongoose.Types.ObjectId(conversationId);

  const [messages, total] = await Promise.all([
    Message.find({
      conversationId: conversationObjectId,
    })
      .populate("senderId", "name email")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(safeLimit),

    Message.countDocuments({
      conversationId: conversationObjectId,
    }),
  ]);

  messages.reverse();

  return {
    messages,

    pagination: {
      page: safePage,

      limit: safeLimit,

      total,

      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

// Create message

export const createMessage = async (
  conversationId: string,
  senderId: string,
  content: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new Error("Invalid conversation ID");
  }

  if (!mongoose.Types.ObjectId.isValid(senderId)) {
    throw new Error("Invalid sender ID");
  }

  const trimmedContent = content.trim();

  if (!trimmedContent) {
    throw new Error("Message content cannot be empty");
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    (participant) => participant.toString() === senderId,
  );

  if (!isParticipant) {
    throw new Error("User is not a participant in this conversation");
  }

  const message = await Message.create({
    conversationId: new mongoose.Types.ObjectId(conversationId),

    senderId: new mongoose.Types.ObjectId(senderId),

    content: trimmedContent,
  });

  // Update conversation timestamp

  await Conversation.findByIdAndUpdate(conversationId, {
    updatedAt: new Date(),
  });

  return message;
};

// Mark conversation messages as read

export const markConversationMessagesAsRead = async (
  conversationId: string,
  userId: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new Error("Invalid conversation ID");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const isParticipant = conversation.participants.some(
    (participant) => participant.toString() === userId,
  );

  if (!isParticipant) {
    throw new Error("User is not a participant in this conversation");
  }

  const result = await Message.updateMany(
    {
      conversationId: new mongoose.Types.ObjectId(conversationId),

      senderId: {
        $ne: new mongoose.Types.ObjectId(userId),
      },

      read: false,
    },

    {
      $set: {
        read: true,
      },
    },
  );

  return result.modifiedCount;
};
