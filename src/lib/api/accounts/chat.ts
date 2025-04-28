// lib/api/accounts/chat.ts
import axios from "axios";
import { getSocket } from "@/lib/socket";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  type: "text" | "image" | "file";
  metadata: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    [key: string]: any;
  };
  read: boolean;
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
}

export interface ChatConversation {
  id: string;
  senderId: string;
  receiverId: string;
  lastMessage: {
    id: string;
    message: string;
    createdAt: string;
  };
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
  receiver: {
    id: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
  unreadCount: number;
}

export async function getAllChats(): Promise<ChatConversation[]> {
  try {
    const response = await axios.get(`${API_URL}/chat`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching chat conversations:", error);
    throw error;
  }
}

export async function getChatMessages(
  userId: string,
  page = 1,
  limit = 20
): Promise<{ messages: ChatMessage[]; hasMore: boolean }> {
  try {
    const response = await axios.get(`${API_URL}/chat/messages/${userId}`, {
      params: { page, limit },
    });
    return {
      messages: response.data.data,
      hasMore: response.data.pagination?.hasMore,
    };
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
}

export async function sendMessage(
  receiverId: string,
  message: string | File,
  type: "text" | "image" | "file" = "text",
  metadata: Record<string, any> = {}
): Promise<ChatMessage> {
  try {
    const socket = getSocket();

    if ((type === "image" || type === "file") && message instanceof File) {
      const formData = new FormData();
      formData.append("receiverId", receiverId);
      formData.append("type", type);
      formData.append(
        "metadata",
        JSON.stringify({
          ...metadata,
          fileName: message.name,
          fileSize: message.size,
          mimeType: message.type,
        })
      );
      formData.append("file", message);

      const response = await axios.post(`${API_URL}/chat/messages`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Emit via socket for real-time update
      socket.emit("send_message", response.data.data);
      return response.data.data;
    } else {
      const response = await axios.post(`${API_URL}/chat/messages`, {
        receiverId,
        message,
        type,
        metadata,
      });

      // Emit via socket for real-time update
      socket.emit("send_message", response.data.data);
      return response.data.data;
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function markMessagesAsRead(
  senderId: string,
  receiverId: string
): Promise<void> {
  try {
    await axios.put(`${API_URL}/chat/messages/read`, {
      senderId,
      receiverId,
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
}

export async function deleteMessage(messageId: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/chat/messages/${messageId}`);
    const socket = getSocket();
    socket.emit("delete_message", messageId);
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}

export const subscribeToNewMessages = (
  callback: (message: ChatMessage) => void
) => {
  const socket = getSocket();
  socket.on("new_message", callback);
  return () => socket.off("new_message", callback);
};

export const subscribeToDeletedMessages = (
  callback: (messageId: string) => void
) => {
  const socket = getSocket();
  socket.on("message_deleted", callback);
  return () => socket.off("message_deleted", callback);
};
