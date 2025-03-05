import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string; // Can be text, a URL to a file, or metadata for a file
  type: "text" | "image" | "file";
  metadata: {
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    [key: string]: any; // Additional metadata
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
  senderId: string;
  receiverId: string;
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
}

/**
 * Fetch all chat conversations for the current user.
 * @returns {Promise<ChatConversation[]>} - List of chat conversations.
 */
export async function getAllChats(): Promise<ChatConversation[]> {
  try {
    const response = await axios.get(`${API_URL}/chat`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching chat conversations:", error);
    return [];
  }
}

/**
 * Fetch messages between the current user and another user.
 * @param {string} userId - The ID of the other user.
 * @returns {Promise<ChatMessage[]>} - List of chat messages.
 */
export async function getChatMessages(userId: string): Promise<ChatMessage[]> {
  try {
    const response = await axios.get(`${API_URL}/chat/messages/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return [];
  }
}

/**
 * Send a message to another user.
 * @param {string} receiverId - The ID of the recipient.
 * @param {string | File} message - The message content.
 * @param {string} type - The type of message ('text' or 'image').
 * @param {Record<string, any>} metadata - Additional metadata for the message.
 * @returns {Promise<ChatMessage>} - The sent message.
 */
export async function sendMessage(
  receiverId: string,
  message: string | File,
  type: "text" | "image" | "file" = "text",
  metadata: Record<string, any> = {}
): Promise<ChatMessage> {
  try {
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
      formData.append("file", message); // Upload file (image or document)

      const response = await axios.post(`${API_URL}/chat/messages`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data;
    } else {
      // Send text message
      const response = await axios.post(`${API_URL}/chat/messages`, {
        receiverId,
        message,
        type,
        metadata,
      });

      return response.data.data;
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

/**
 * Delete a message by its ID.
 * @param {string} messageId - The ID of the message to delete.
 * @returns {Promise<void>}
 */
export async function deleteMessage(messageId: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/chat/messages/${messageId}`);
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}
