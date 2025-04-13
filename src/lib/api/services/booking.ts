import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Booking {
  id: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no-show";
  totalAmount: number;
  totalDuration: number;
  paymentStatus: "pending" | "paid" | "partial" | "refunded";
  escrowStatus?: "pending" | "held" | "released" | "refunded";
  escrowReleaseDate?: string;
  provider: {
    id: string;
    businessName?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    photo?: string;
  };
  customer: {
    id: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  service: {
    name: string;
    description: string;
    price: number;
    duration: number;
    images: string[];
  };

  metadata?: any;
}

export interface ServiceAvailability {
  availableSlots: string[];
  duration: number;
}

export interface ProviderSchedule {
  schedule: any;
  unavailableDates: string[];
  bookings: Array<{
    date: string;
    time: string;
    duration: number;
  }>;
}

export interface CreateBookingPayload {
  services: Array<string>;
  date: string;
  time: string;
  notes?: string;
  paymentMethod?: string;
  useWallet?: boolean;
  customerInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
}

export interface RescheduleBookingPayload {
  date: string;
  time: string;
}

export interface CancelBookingPayload {
  reason: string;
}

export interface ProcessPaymentPayload {
  paymentMethod: string;
  amount?: number;
  useWallet?: boolean;
}

export async function getBookings({
  status,
  page = 1,
  limit = 10,
}: {
  status?: string;
  page?: number;
  limit?: number;
} = {}) {
  try {
    const response = await axios.get(`${API_URL}/bookings`, {
      params: { status, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    // Return dummy data if API fails
    return {
      bookings: [
        {
          id: "121445",
          date: "2025-03-01",
          time: "10:00",
          provider: {
            id: "1",
            businessName: "Luxe Hair Studio",
            firstName: "Studio",
            lastName: "Hairdo",
            phone: "078954788555",
            address: "123 Beauty Lane, London",
            photo:
              "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1974&auto=format&fit=crop",
          },
          customer: {
            id: "1",
            firstName: "Studio",
            lastName: "Hairdo",
            phone: "078954788555",
          },
          service: {
            name: "Hair Styling",
            description: "Professional hair styling service",
            price: 75.0,
            duration: 60,
            images: [
              "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1974&auto=format&fit=crop",
            ],
          },
          status: "confirmed",
          paymentStatus: "pending",
        },
      ],
      pagination: {
        total: 1,
        page: 1,
        totalPages: 1,
      },
    };
  }
}

export async function getServiceAvailability(id: string, date: string) {
  console.log(date);
  try {
    const response = await axios.get(
      `${API_URL}/bookings/services/${id}/availability?date=${date}`
    );
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching service availability:", error);
    // Return dummy data if API fails
    return {
      availableSlots: ["10:00", "11:00", "12:00"],
      duration: 60,
    };
  }
}

export async function getProviderSchedule(
  id: string,
  startDate: string,
  endDate: string
) {
  try {
    const response = await axios.get(
      `${API_URL}/bookings/providers/${id}/schedule`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching provider schedule:", error);
    // Return dummy data if API fails
    return {
      schedule: {
        monday: { start: "09:00", end: "17:00", breaks: [] },
        tuesday: { start: "09:00", end: "17:00", breaks: [] },
      },
      unavailableDates: [],
      bookings: [
        {
          date: "2025-02-25",
          time: "10:00",
          duration: 60,
        },
      ],
    };
  }
}

export async function createBooking(payload: CreateBookingPayload) {
  try {
    const response = await axios.post(`${API_URL}/bookings/services/`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

export async function getBookingDetails(id: string) {
  try {
    const response = await axios.get(`${API_URL}/bookings/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    // Return dummy data if API fails
    return {
      id: "121445",
      date: "2025-03-01",
      time: "10:00",
      provider: {
        id: "1",
        businessName: "Luxe Hair Studio",
        firstName: "Studio",
        lastName: "Hairdo",
        phone: "078954788555",
        address: "123 Beauty Lane, London",
        photo:
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1974&auto=format&fit=crop",
      },
      customer: {
        id: "1",
        firstName: "Studio",
        lastName: "Hairdo",
        phone: "078954788555",
      },
      service: {
        name: "Hair Styling",
        description: "Professional hair styling service",
        price: 75.0,
        duration: 60,
        images: [
          "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1974&auto=format&fit=crop",
        ],
      },
      status: "confirmed",
      paymentStatus: "pending",
    };
  }
}

export async function rescheduleBooking(
  id: string,
  payload: RescheduleBookingPayload
) {
  try {
    const response = await axios.put(
      `${API_URL}/bookings/${id}/reschedule`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error rescheduling booking:", error);
    throw error;
  }
}

export async function cancelBooking(id: string, payload: CancelBookingPayload) {
  try {
    const response = await axios.put(
      `${API_URL}/bookings/${id}/cancel`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
}
export async function confirmBooking(id: string) {
  try {
    const response = await axios.put(`${API_URL}/bookings/${id}/confirm`);
    return response.data.data;
  } catch (error) {
    console.error("Error confirming booking:", error);
    throw error;
  }
}

export async function completeBooking(id: string) {
  try {
    const response = await axios.put(`${API_URL}/bookings/${id}/complete`);
    return response.data.data;
  } catch (error) {
    console.error("Error completing booking:", error);
    throw error;
  }
}

export async function noShowBooking(
  id: string
  // , payload: CancelBookingPayload
) {
  try {
    const response = await axios.put(
      `${API_URL}/bookings/${id}/no-show`
      // payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error marking booking as no-show:", error);
    throw error;
  }
}

export async function processPayment(
  id: string,
  payload: ProcessPaymentPayload
) {
  try {
    const response = await axios.put(
      `${API_URL}/bookings/${id}/payment`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
}

export async function getCalendarEvents({
  startDate,
  endDate,
  userId,
}: {
  startDate: string;
  endDate: string;
  userId?: string;
}) {
  try {
    const response = await axios.get(`${API_URL}/bookings/calendar/events`, {
      params: { startDate, endDate, userId },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    // Return dummy data if API fails
    return [
      {
        id: "booking-123",
        title: "Haircut",
        start: "2025-02-25T10:00",
        end: "2025-02-25T11:00",
        extendedProps: {
          status: "confirmed",
          customer: {
            id: "cust-123",
            firstName: "John",
            lastName: "Doe",
          },
          provider: {
            id: "prov-456",
            firstName: "Jane",
            lastName: "Smith",
            businessName: "Jane's Salon",
          },
          services: [
            {
              id: "service-789",
              name: "Haircut",
            },
          ],
        },
      },
    ];
  }
}

export async function syncCalendar() {
  try {
    const response = await axios.post(`${API_URL}/bookings/calendar/sync`);
    return response.data.data;
  } catch (error) {
    console.error("Error syncing calendar:", error);
    throw error;
  }
}
