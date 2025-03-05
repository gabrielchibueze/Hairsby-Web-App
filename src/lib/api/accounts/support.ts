import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

// Interface for SupportTicket
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  assignedTo?: string;
  dueDate?: string;
  resolvedAt?: string;
  metadata?: {
    chatHistory?: Array<{
      id: string;
      userId: string;
      userRole: string;
      type: string;
      message: string;
      attachments?: string[];
      timestamp: string;
      readBy: string[];
    }>;
    notes?: Array<{
      id: string;
      note: string;
      createdBy: string;
      createdAt: string;
    }>;
    escalations?: Array<{
      id: string;
      reason: string;
      escalatedBy: string;
      escalatedAt: string;
      previousPriority: string;
    }>;
    assignmentHistory?: Array<{
      assignedTo: string;
      assignedBy: string;
      assignedAt: string;
    }>;
    ticketClosed?: Array<{
      closedBy: string;
      closedAt: string;
      reasonForClosing: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

// Create a new support ticket
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

// Get all support tickets for the authenticated user
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

// Get a specific support ticket by ID
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

// Update a specific support ticket
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

// Close a specific support ticket
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

// Get chat history for a specific support ticket
export async function getSupportTicketChatHistory(ticketId: string): Promise<
  Array<{
    id: string;
    userId: string;
    userRole: string;
    type: string;
    message: string;
    attachments?: string[];
    timestamp: string;
    readBy: string[];
  }>
> {
  try {
    const response = await axios.get(`${API_URL}/support/ticket/chat/history`, {
      params: { ticketId },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
}

// Send a chat message for a specific support ticket
export async function sendSupportTicketChatMessage(
  ticketId: string,
  data: {
    message: string;
    type?: string;
    attachments?: string[];
  }
): Promise<{
  id: string;
  userId: string;
  userRole: string;
  type: string;
  message: string;
  attachments?: string[];
  timestamp: string;
  readBy: string[];
}> {
  try {
    const response = await axios.post(
      `${API_URL}/support/ticket/chat/message`,
      { ticketId, ...data }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
}

// Admin-only functions
// Get all support tickets (admin only)
export async function getAllSupportTickets(params?: {
  status?: string;
  priority?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{
  tickets: SupportTicket[];
  pagination: { total: number; page: number; totalPages: number };
}> {
  try {
    const response = await axios.get(`${API_URL}/support/tickets/all`, {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all support tickets:", error);
    throw error;
  }
}

// Get unassigned support tickets (admin only)
export async function getUnassignedSupportTickets(params?: {
  page?: number;
  limit?: number;
}): Promise<{
  tickets: SupportTicket[];
  pagination: { total: number; page: number; totalPages: number };
}> {
  try {
    const response = await axios.get(`${API_URL}/support/tickets/unassigned`, {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching unassigned support tickets:", error);
    throw error;
  }
}

// Get overdue support tickets (admin only)
export async function getOverdueSupportTickets(params?: {
  page?: number;
  limit?: number;
}): Promise<{
  tickets: SupportTicket[];
  pagination: { total: number; page: number; totalPages: number };
}> {
  try {
    const response = await axios.get(`${API_URL}/support/tickets/overdue`, {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching overdue support tickets:", error);
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
      `${API_URL}/support/tickets/${id}/assign`,
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
      `${API_URL}/support/tickets/${id}/escalate`,
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
      `${API_URL}/support/tickets/${id}/resolve`,
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
    const response = await axios.post(
      `${API_URL}/support/tickets/${id}/note`,
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
    const response = await axios.get(`${API_URL}/support/tickets/metrics`, {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching support ticket metrics:", error);
    throw error;
  }
}
