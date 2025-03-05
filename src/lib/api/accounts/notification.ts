import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

// Interface for Notification
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// Get all notifications for the authenticated user
export async function getNotifications(): Promise<Notification[]> {
  try {
    const response = await axios.get(`${API_URL}/notifications`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
}

// Mark a specific notification as read
export async function markNotificationAsRead(id: string): Promise<void> {
  try {
    await axios.put(`${API_URL}/notifications/${id}/read`);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
}

// Mark all notifications as read for the authenticated user
export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    await axios.put(`${API_URL}/notifications/read-all`);
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}

// Delete a specific notification
export async function deleteNotification(id: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/notifications/${id}`);
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
}
