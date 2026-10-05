import api from "./axios";

// Notification types

export type NotificationType =
  | "message"
  | "booking"
  | "cancellation"
  | "payment"
  | "bus_update";

export interface Notification {
  _id: string;

  userId: string;

  type: NotificationType;

  title: string;

  message: string;

  read: boolean;

  referenceId: string | null;

  createdAt: string;

  updatedAt: string;
}

export interface NotificationPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

export interface PaginatedNotifications {
  notifications: Notification[];

  pagination: NotificationPagination;
}

export const getUserNotifications = async (
  userId: string,
  page = 1,
  limit = 20,
): Promise<PaginatedNotifications> => {
  const response = await api.get<{
    success: boolean;

    data: Notification[];

    pagination: NotificationPagination;
  }>(`/notifications/user/${userId}?page=${page}&limit=${limit}`);

  return {
    notifications: response.data.data,

    pagination: response.data.pagination,
  };
};

export const getUnreadNotificationCount = async (
  userId: string,
): Promise<number> => {
  const response = await api.get<{
    success: boolean;

    data: {
      count: number;
    };
  }>(`/notifications/user/${userId}/unread-count`);

  return response.data.data.count;
};

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string,
): Promise<Notification> => {
  const response = await api.patch<{
    success: boolean;

    data: Notification;
  }>("/notifications/read", {
    notificationId,
    userId,
  });

  return response.data.data;
};

export const markAllNotificationsAsRead = async (
  userId: string,
): Promise<number> => {
  const response = await api.patch<{
    success: boolean;

    data: {
      modifiedCount: number;
    };
  }>("/notifications/read-all", {
    userId,
  });

  return response.data.data.modifiedCount;
};
