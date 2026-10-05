import { Router } from "express";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";

const router = Router();

// Get notifications
router.get("/user/:userId", getNotifications);

router.get("/user/:userId/unread-count", getUnreadCount);

router.patch("/read", markAsRead);

router.patch("/read-all", markAllAsRead);

export default router;
