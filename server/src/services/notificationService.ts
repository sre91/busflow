import mongoose from "mongoose";

import Notification, { type NotificationType } from "../models/Notification.js";

export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  referenceId: string | null = null,
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (referenceId !== null && !mongoose.Types.ObjectId.isValid(referenceId)) {
    throw new Error("Invalid reference ID");
  }

  const notification = await Notification.create({
    userId: new mongoose.Types.ObjectId(userId),

    type,

    title,

    message,

    referenceId:
      referenceId !== null ? new mongoose.Types.ObjectId(referenceId) : null,
  });

  return notification;
};

export const getUserNotifications = async (
  userId: string,
  page = 1,
  limit = 20,
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const safePage = Math.max(Number(page) || 1, 1);

  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);

  const skip = (safePage - 1) * safeLimit;

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [notifications, total] = await Promise.all([
    Notification.find({
      userId: userObjectId,
    })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(safeLimit),

    Notification.countDocuments({
      userId: userObjectId,
    }),
  ]);

  return {
    notifications,

    pagination: {
      page: safePage,
      limit: safeLimit,
      total,

      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new Error("Invalid notification ID");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const notification = await Notification.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(notificationId),

      userId: new mongoose.Types.ObjectId(userId),
    },

    {
      $set: {
        read: true,
      },
    },

    {
      new: true,
    },
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

export const markAllNotificationsAsRead = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const result = await Notification.updateMany(
    {
      userId: new mongoose.Types.ObjectId(userId),

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

export const getUnreadNotificationCount = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const count = await Notification.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),

    read: false,
  });

  return count;
};
