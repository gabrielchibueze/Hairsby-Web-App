// lib/api/accounts/support.ts
import axios from "axios";
import { getSocket } from "@/lib/socket";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface SupportTicketMessage {
  id: string;
  userId: string;
  userRole: string;
  type: string;
  message: string;
  attachments?: string[];
  timestamp: string;
  readBy: string[];
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  assignedTo?: string;
  dueDate?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    chatHistory?: SupportTicketMessage[];
    notes?: Array<{
      id: string;
      note: string;
      createdBy: string;
      createdAt: string;
    }>;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export async function createSupportTicket(data: {
  subject: string;
  description: string;
  priority: string;
  category: string;
}): Promise<SupportTicket> {
  try {
    const response = await axios.post(`${API_URL}/support/tickets`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating support ticket:", error);
    throw error;
  }
}

export async function getUserSupportTickets(params?: {
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}): Promise<{
  tickets: SupportTicket[];
  pagination: { total: number; page: number; totalPages: number };
}> {
  try {
    const response = await axios.get(`${API_URL}/support/tickets`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user support tickets:", error);
    throw error;
  }
}

export async function getUserSupportTicketById(
  id: string
): Promise<SupportTicket> {
  try {
    const response = await axios.get(`${API_URL}/support/tickets/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching support ticket by ID:", error);
    throw error;
  }
}

export async function updateUserSupportTicket(
  id: string,
  data: {
    subject?: string;
    description?: string;
    priority?: string;
  }
): Promise<SupportTicket> {
  try {
    const response = await axios.put(`${API_URL}/support/tickets/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating support ticket:", error);
    throw error;
  }
}

export async function closeUserSupportTicket(
  id: string,
  reason?: string
): Promise<void> {
  try {
    await axios.put(`${API_URL}/support/tickets/${id}/close`, { reason });
  } catch (error) {
    console.error("Error closing support ticket:", error);
    throw error;
  }
}

export async function getSupportTicketChatHistory(
  id: string
): Promise<SupportTicketMessage[]> {
  try {
    const response = await axios.get(
      `${API_URL}/support/tickets/${id}/chat/history`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
}

export async function sendSupportTicketChatMessage(
  id: string,
  data: {
    message: string;
    type?: string;
    attachments?: string[];
  }
): Promise<SupportTicketMessage> {
  try {
    const response = await axios.post(
      `${API_URL}/support/tickets/${id}/chat/message`,
      data
    );

    // Emit via socket for real-time update
    const socket = getSocket();
    socket.emit("support_message", {
      ticketId: id,
      message: response.data.data,
    });

    return response.data.data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
}

export const subscribeToSupportMessages = (
  ticketId: string,
  callback: (message: SupportTicketMessage) => void
) => {
  const socket = getSocket();
  socket.on(`support_message_${ticketId}`, callback);
  return () => socket.off(`support_message_${ticketId}`, callback);
};

export const subscribeToTicketUpdates = (
  ticketId: string,
  callback: (ticket: SupportTicket) => void
) => {
  const socket = getSocket();
  socket.on(`ticket_update_${ticketId}`, callback);
  return () => socket.off(`ticket_update_${ticketId}`, callback);
};

// Admin-only functions
// Get all support tickets (admin only)
export async function getAllSupportTickets(params?: {
  status?:
    | "open"
    | "in-progress"
    | "resolved"
    | "closed"
    | "overdue"
    | "unassigned";
  priority?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{
  tickets: SupportTicket[];
  pagination: { total: number; page: number; totalPages: number };
}> {
  try {
    const response = await axios.get(`${API_URL}/support/admin/tickets/all`, {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all support tickets:", error);
    throw error;
  }
}

// Assign a support ticket to a staff member (admin only)
export async function assignSupportTicket(
  id: string,
  data: { assigneeId: string }
): Promise<SupportTicket> {
  try {
    const response = await axios.put(
      `${API_URL}/support/admin/tickets/${id}/assign`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error assigning support ticket:", error);
    throw error;
  }
}

// Escalate a support ticket (admin only)
export async function escalateSupportTicket(
  id: string,
  data: { reason: string; priority?: string }
): Promise<SupportTicket> {
  try {
    const response = await axios.put(
      `${API_URL}/support/admin/tickets/${id}/escalate`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error escalating support ticket:", error);
    throw error;
  }
}

// Resolve a support ticket (admin only)
export async function resolveSupportTicket(
  id: string,
  data: { resolution: string }
): Promise<SupportTicket> {
  try {
    const response = await axios.put(
      `${API_URL}/support/admin/tickets/${id}/resolve`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error resolving support ticket:", error);
    throw error;
  }
}

// Add an internal note to a support ticket (admin only)
export async function addInternalNoteToSupportTicket(
  id: string,
  data: { note: string }
): Promise<SupportTicket> {
  try {
    const response = await axios.put(
      `${API_URL}/support/admin/tickets/${id}/note`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error adding internal note:", error);
    throw error;
  }
}

// Get support ticket metrics (admin only)
export async function getSupportTicketMetrics(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<{
  totalTickets: number;
  byStatus: Array<{ status: string; count: number }>;
  byPriority: Array<{ priority: string; count: number }>;
  byCategory: Array<{ category: string; count: number }>;
  averageResolutionTime: number;
}> {
  try {
    const response = await axios.get(
      `${API_URL}/support/admin/tickets/metrics`,
      {
        params,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching support ticket metrics:", error);
    throw error;
  }
}
