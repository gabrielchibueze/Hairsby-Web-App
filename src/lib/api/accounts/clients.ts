import axios from "axios";
import { Booking } from "@/lib/api/services/booking";
import { Order } from "@/lib/api/products/order";
import { ErrorToastResponse } from "@/lib/utils/errorToast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  email: string;
  phone: string;
  photo: string;
  gender?: string;
  dob?: string;
  address?: string;
  city?: string;
  country?: string;
  postcode?: string;
  rating: number;
  totalReviews: number;
  createdAt: string;
  lastSeen?: string;
  metadata?: {
    notes?: {
      [providerId: string]: {
        content: string;
        updatedAt: string;
      };
    };
  };
  notificationPreferences?: {
    reminders?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    promotions?: {
      email?: boolean;
      push?: boolean;
    };
    systemAlerts?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
  };
  bookings?: Booking[];
  orders?: Order[];
}

export interface ClientDetails extends Client {
  stats?: {
    bookings: {
      totalBookings: number;
      totalSpent: number;
      completedBookings: number;
      cancelledBookings: number;
    };
    orders: {
      totalOrders: number;
      totalSpent: number;
      completedOrders: number;
      cancelledOrders: number;
    };
  };
}

export interface ClientBookingsResponse {
  bookings: Booking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ClientOrdersResponse {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MarketingEmailPayload {
  subject: string;
  message: string;
  offerCode?: string;
  expiryDate?: string;
}

// Get all clients
export async function getClients(
  page = 1,
  limit = 20,
  search = ""
): Promise<{ clients: Client[]; pagination: any }> {
  try {
    const response = await axios.get(`${API_URL}/clients`, {
      params: { page, limit, search },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}

// Get client details
export async function getClientDetails(
  clientId: string
): Promise<ClientDetails> {
  try {
    const response = await axios.get(`${API_URL}/clients/${clientId}`);
    return response.data.data.client;
  } catch (error) {
    console.error("Error fetching client details:", error);
    throw error;
  }
}

// Get client bookings
export async function getClientBookings(
  clientId: string,
  status?: string,
  page = 1,
  limit = 10
): Promise<ClientBookingsResponse> {
  try {
    const response = await axios.get(
      `${API_URL}/clients/${clientId}/bookings`,
      {
        params: { status, page, limit },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching client bookings:", error);
    throw error;
  }
}

// Get client orders
export async function getClientOrders(
  clientId: string,
  status?: string,
  page = 1,
  limit = 10
): Promise<ClientOrdersResponse> {
  try {
    const response = await axios.get(`${API_URL}/clients/${clientId}/orders`, {
      params: { status, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching client orders:", error);
    throw error;
  }
}

// Send booking reminder
export async function sendBookingReminder(
  clientId: string,
  bookingId: string
): Promise<void> {
  try {
    await axios.post(`${API_URL}/clients/${clientId}/send-booking-reminder`, {
      bookingId,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to send booking reminder"
      );
    }
    console.error("Error sending booking reminder:", error);
    throw new Error("Failed to send booking reminder");
  }
}

// Send order reminder
export async function sendOrderReminder(
  clientId: string,
  orderId: string
): Promise<void> {
  try {
    await axios.post(`${API_URL}/clients/${clientId}/send-order-reminder`, {
      orderId,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to send order reminder"
      );
    }
    console.error("Error sending order reminder:", error);
    throw new Error("Failed to send order reminder");
  }
}

// Send marketing email
export async function sendMarketingEmail(
  clientId: string,
  data: MarketingEmailPayload
): Promise<void> {
  try {
    await axios.post(
      `${API_URL}/clients/${clientId}/send-marketing-email`,
      data
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to send marketing email"
      );
    }
    console.error("Error sending marketing email:", error);
    throw new Error("Failed to send marketing email");
  }
}

// Bulk send marketing emails
export async function bulkSendMarketingEmails(
  clientIds: string[],
  data: MarketingEmailPayload
): Promise<{
  total: number;
  sent: number;
  skipped: number;
  skippedDetails: Array<{ clientId: string; reason: string }>;
}> {
  try {
    const response = await axios.post(
      `${API_URL}/clients/bulk-send-marketing-emails`,
      {
        ...data,
        clientIds,
      }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to send bulk marketing emails"
      );
    }
    console.error("Error sending bulk marketing emails:", error);
    throw new Error("Failed to send bulk marketing emails");
  }
}

// Update client notes
export async function updateClientNotes(
  clientId: string,
  notes: string
): Promise<void> {
  try {
    await axios.put(`${API_URL}/clients/${clientId}/notes`, { notes });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update client notes"
      );
    }
    console.error("Error updating client notes:", error);
    throw new Error("Failed to update client notes");
  }
}

// Get client upcoming bookings
export async function getClientUpcomingBookings(
  clientId: string,
  limit = 5
): Promise<Booking[]> {
  try {
    const response = await axios.get(
      `${API_URL}/clients/${clientId}/upcoming-bookings`,
      { params: { limit } }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching upcoming bookings:", error);
    throw error;
  }
}

// Get client recent orders
export async function getClientRecentOrders(
  clientId: string,
  limit = 5
): Promise<Order[]> {
  try {
    const response = await axios.get(
      `${API_URL}/clients/${clientId}/recent-orders`,
      { params: { limit } }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw error;
  }
}
