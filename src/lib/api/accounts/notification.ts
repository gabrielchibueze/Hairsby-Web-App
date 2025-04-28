// lib/api/accounts/notification.ts
import axios from "axios";
import { getSocket } from "@/lib/socket";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  data?: {
    [key: string]: any;
    ticketId?: string;
    messageId?: string;
    bookingId?: string;
    orderId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function getNotifications(): Promise<Notification[]> {
  try {
    const response = await axios.get(`${API_URL}/notifications`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

export async function getNotificationDetails(
  id: string
): Promise<Notification> {
  try {
    const response = await axios.get(`${API_URL}/notifications/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching notification details:", error);
    throw error;
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    await axios.put(`${API_URL}/notifications/${id}/read`);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    await axios.put(`${API_URL}/notifications/read-all`);
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}

export async function deleteNotification(id: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/notifications/${id}`);
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
}

export const subscribeToNewNotifications = (
  callback: (notification: Notification) => void
) => {
  const socket = getSocket();
  socket.on("new_notification", callback);
  return () => socket.off("new_notification", callback);
};

export const subscribeToNotificationUpdates = (
  callback: (notification: Notification) => void
) => {
  const socket = getSocket();
  socket.on("notification_updated", callback);
  return () => socket.off("notification_updated", callback);
};
