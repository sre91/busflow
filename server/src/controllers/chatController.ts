import { Request, Response, NextFunction } from "express";

import {
  findOrCreateConversation,
  getUserConversations,
  getConversationMessages,
  createMessage,
  markConversationMessagesAsRead,
} from "../services/chatService.js";

export const createConversation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, otherUserId } = req.body;

    if (typeof userId !== "string" || typeof otherUserId !== "string") {
      return res.status(400).json({
        success: false,
        message: "userId and otherUserId are required",
      });
    }

    const conversation = await findOrCreateConversation(userId, otherUserId);

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;

    if (typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const conversations = await getUserConversations(userId);

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { conversationId } = req.params;

    if (typeof conversationId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const page =
      typeof req.query.page === "string" ? Number(req.query.page) : 1;

    const limit =
      typeof req.query.limit === "string" ? Number(req.query.limit) : 30;

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer",
      });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 50",
      });
    }

    const result = await getConversationMessages(conversationId, page, limit);

    return res.status(200).json({
      success: true,

      data: result.messages,

      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// Send message

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { conversationId, senderId, content } = req.body;

    if (
      typeof conversationId !== "string" ||
      typeof senderId !== "string" ||
      typeof content !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "conversationId, senderId and content are required",
      });
    }

    const message = await createMessage(conversationId, senderId, content);

    return res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

export const markMessagesAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { conversationId, userId } = req.body;

    if (typeof conversationId !== "string" || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        message: "conversationId and userId are required",
      });
    }

    const modifiedCount = await markConversationMessagesAsRead(
      conversationId,
      userId,
    );

    return res.status(200).json({
      success: true,

      data: {
        modifiedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
