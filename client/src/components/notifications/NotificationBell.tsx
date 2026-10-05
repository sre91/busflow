import { useEffect, useRef, useState } from "react";
import {
  Bell,
  BellRing,
  CheckCheck,
  CircleCheck,
  CreditCard,
  Info,
  MessageCircle,
  Ticket,
  X,
} from "lucide-react";

import {
  getUnreadNotificationCount,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type Notification,
} from "../../api/notificationApi";

import socket from "../../socket";

import { useAppSelector } from "../../app/hooks";

function NotificationBell() {
  const user = useAppSelector((state) => state.auth.user);

  const currentUserId = user?.id || "";

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  // Format notification time

  const formatNotificationTime = (date: string) => {
    const createdAt = new Date(date);
    const now = new Date();

    const difference = now.getTime() - createdAt.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
    }

    if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    if (days < 7) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }

    return createdAt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Notification icon

  const getNotificationIcon = (notification: Notification) => {
    switch (notification.type) {
      case "booking":
        return <Ticket size={17} />;

      case "payment":
        return <CreditCard size={17} />;

      case "message":
        return <MessageCircle size={17} />;

      case "cancellation":
        return <CircleCheck size={17} />;

      case "bus_update":
        return <Info size={17} />;

      default:
        return <Bell size={17} />;
    }
  };

  // Load notifications

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const loadNotifications = async () => {
      try {
        const [notificationResult, count] = await Promise.all([
          getUserNotifications(currentUserId, 1, 20),
          getUnreadNotificationCount(currentUserId),
        ]);

        setNotifications(notificationResult.notifications);
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    loadNotifications();
  }, [currentUserId]);

  // Join user notification room

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const joinUserRoom = () => {
      socket.emit("joinUser", currentUserId);

      console.log(`👤 Joined notification room: user:${currentUserId}`);
    };

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", joinUserRoom);

    if (socket.connected) {
      joinUserRoom();
    }

    return () => {
      socket.off("connect", joinUserRoom);
    };
  }, [currentUserId]);

  // Receive real-time notification

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const handleNewNotification = (notification: Notification) => {
      if (notification.userId !== currentUserId) {
        return;
      }

      setNotifications((currentNotifications) => {
        const alreadyExists = currentNotifications.some(
          (item) => item._id === notification._id,
        );

        if (alreadyExists) {
          return currentNotifications;
        }

        return [notification, ...currentNotifications];
      });

      setUnreadCount((currentCount) => currentCount + 1);
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [currentUserId]);

  // Close when clicking outside

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Mark notification as read

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.read || !currentUserId) {
      return;
    }

    try {
      const updatedNotification = await markNotificationAsRead(
        notification._id,
        currentUserId,
      );

      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item._id === updatedNotification._id ? updatedNotification : item,
        ),
      );

      setUnreadCount((currentCount) => Math.max(currentCount - 1, 0));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all notifications as read

  const handleMarkAllAsRead = async () => {
    if (!currentUserId || unreadCount === 0) {
      return;
    }

    try {
      await markAllNotificationsAsRead(currentUserId);

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          read: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // Not logged in

  if (!currentUserId) {
    return null;
  }

  return (
    <div ref={notificationRef} className="relative">
      {/* Notification bell */}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={
          unreadCount > 0
            ? `${unreadCount} unread notifications`
            : "Notifications"
        }
        aria-expanded={isOpen}
        className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition ${
          isOpen
            ? "bg-primary/10 text-primary"
            : "text-muted hover:bg-background hover:text-primary"
        }`}
      >
        {unreadCount > 0 ? <BellRing size={21} /> : <Bell size={21} />}

        {/* Unread indicator */}

        {unreadCount > 0 && (
          <>
            <span className="absolute right-1 top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />

            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </>
        )}
      </button>

      {/* Notification panel */}

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-96 overflow-hidden rounded-2xl border border-slate-200 bg-surface shadow-xl shadow-slate-900/10 sm:w-96">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {unreadCount > 0 ? <BellRing size={18} /> : <Bell size={18} />}
              </div>

              <div>
                <h3 className="font-bold text-primary-dark">Notifications</h3>

                <p className="mt-0.5 text-xs text-muted">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${
                        unreadCount === 1 ? "" : "s"
                      }`
                    : "You're all caught up"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close notifications"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-background hover:text-primary-dark"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mark all */}

          {unreadCount > 0 && (
            <div className="border-b border-slate-100 px-4 py-2.5">
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary transition hover:text-primary-dark"
              >
                <CheckCheck size={15} />
                Mark all as read
              </button>
            </div>
          )}

          {/* Notification list */}

          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 && (
              <div className="px-5 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Bell size={26} />
                </div>

                <p className="mt-4 text-sm font-semibold text-primary-dark">
                  No notifications yet
                </p>

                <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted">
                  Booking updates, travel reminders, and support messages will
                  appear here.
                </p>
              </div>
            )}

            {notifications.map((notification) => (
              <button
                type="button"
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full cursor-pointer border-b border-slate-100 px-4 py-3.5 text-left transition last:border-b-0 hover:bg-background ${
                  notification.read ? "bg-surface" : "bg-primary/[0.04]"
                }`}
              >
                <div className="flex gap-3">
                  {/* Notification icon */}

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      notification.read
                        ? "bg-slate-100 text-muted"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {getNotificationIcon(notification)}
                  </div>

                  {/* Content */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-primary-dark">
                        {notification.title}
                      </p>

                      {!notification.read && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-[10px] font-medium text-muted">
                      {formatNotificationTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
