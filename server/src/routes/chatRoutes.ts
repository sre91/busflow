import { Router } from "express";

import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "../controllers/chatController.js";

import { chatMessageRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/conversations", createConversation);

router.get("/conversations/user/:userId", getConversations);

router.get("/conversations/:conversationId/messages", getMessages);

router.post("/messages", chatMessageRateLimiter, sendMessage);
router.patch("/messages/read", markMessagesAsRead);

export default router;
