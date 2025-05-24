"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  Check,
  ChevronRight,
  CreditCard,
  Mail,
  MessageSquare,
  ShoppingCart,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Notification } from "@/lib/api/accounts/notification";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  subscribeToNewNotifications,
} from "@/lib/api/accounts/notification";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/contexts/auth.context";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";

export function NotificationDropdown({ plain }: { plain?: boolean }) {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to new notifications
    const unsubscribe = subscribeToNewNotifications((notification) => {
      if (notification.userId === user?.id) {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      const result = unsubscribe();
      // If the result is a socket, ignore it
      if (result && typeof result.on === "function") {
        // This is a socket, we don't need to do anything with it
      }
    };
  }, [user?.id]);
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) =>
        notifications.find((n) => n.id === id)?.read ? prev : prev - 1
      );
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }

    // Handle navigation based on notification type
    if (notification.data?.ticketId) {
      router.push(`/dashboard/support/tickets/${notification.data.ticketId}`);
    } else if (notification.data?.messageId) {
      router.push(`/dashboard/chat?userId=${notification.data.messageId}`);
    } else if (notification.data?.bookingId) {
      router.push(
        `/${user?.role === "customer" ? "dashboard" : "provider"}/bookings/${notification.data.bookingId}`
      );
    } else if (notification.data?.orderId) {
      router.push(
        `/${user?.role === "customer" ? "dashboard" : "provider"}/orders/${notification.data.orderId}`
      );
    }

    setOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "booking":
        return <Calendar className="h-4 w-4" />;
      case "order":
        return <ShoppingCart className="h-4 w-4" />;
      case "payment":
        return <CreditCard className="h-4 w-4" />;
      case "support":
        return <Mail className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`${plain ? "text-background hover:text-background" : "text-foreground hover:text-foreground"} hover:bg-hairsby-orange/40  relative`}
          title="My Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-hairsby-orange"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 sm:w-96 border border-border bg-background text-foreground"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {notifications.some((n) => !n.read) && (
            <Button
              variant="link"
              size="sm"
              className="text-hairsby-orange hover:text-hairsby-orange/80 p-0 h-auto"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <ScrollArea className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 hover:bg-accent/10 focus:bg-accent/10",
                    !notification.read && "bg-accent/5"
                  )}
                >
                  <Avatar
                    className=""
                    size="sm"
                    fallback={<>{getNotificationIcon(notification.type)}</>}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3
                        className="font-medium hover:text-muted-foreground cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-1 ml-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-hairsby-orange"></span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          )}
        </ScrollArea>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem className="justify-center">
          <Link
            href="/dashboard/notifications"
            className="text-sm text-hairsby-orange hover:text-hairsby-orange/80"
            onClick={() => setOpen(false)}
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
