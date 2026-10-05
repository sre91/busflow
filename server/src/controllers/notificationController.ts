import { Request, Response, NextFunction } from "express";

import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notificationService.js";

export const getNotifications = async (
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

    const page =
      typeof req.query.page === "string" ? Number(req.query.page) : 1;

    const limit =
      typeof req.query.limit === "string" ? Number(req.query.limit) : 20;

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

    const result = await getUserNotifications(userId, page, limit);

    return res.status(200).json({
      success: true,

      data: result.notifications,

      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { notificationId, userId } = req.body;

    if (typeof notificationId !== "string" || typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        message: "notificationId and userId are required",
      });
    }

    const notification = await markNotificationAsRead(notificationId, userId);

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.body;

    if (typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const modifiedCount = await markAllNotificationsAsRead(userId);

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

export const getUnreadCount = async (
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

    const count = await getUnreadNotificationCount(userId);

    return res.status(200).json({
      success: true,

      data: {
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};
