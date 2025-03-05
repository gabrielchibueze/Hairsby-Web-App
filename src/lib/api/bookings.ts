import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Booking {
  id: string;
  date: string;
  time: string;
  service: {
    name: string;
    description: string;
    price: number;
    duration: number;
    images: string[];
    provider: {
      id: string;
      businessName: string;
      address: string;
      photo: string;
    };
  };
  status: string;
  paymentStatus: string;
}

export async function getServiceAvailability(
  serviceId: string,
  date?: Date
): Promise<string[]> {
  if (!date) return [];

  try {
    const response = await axios.get(
      `${API_URL}/services/${serviceId}/availability`,
      {
        params: {
          date: date.toISOString().split("T")[0],
        },
      }
    );
    return response.data.data.availableSlots;
  } catch (error) {
    console.error("Error fetching availability:", error);
    return [];
  }
}

export async function createBooking(data: {
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
}): Promise<Booking> {
  try {
    const response = await axios.post(`${API_URL}/bookings`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

export async function getBookingById(id: string): Promise<Booking> {
  try {
    const response = await axios.get(`${API_URL}/bookings/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    // Return dummy data if API fails
    return {
      id,
      date: "2025-03-01",
      time: "10:00",
      service: {
        name: "Hair Styling",
        description: "Professional hair styling service",
        price: 75.0,
        duration: 60,
        images: [
          "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1974&auto=format&fit=crop",
        ],
        provider: {
          id: "1",
          businessName: "Luxe Hair Studio",
          address: "123 Beauty Lane, London",
          photo:
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1974&auto=format&fit=crop",
        },
      },
      status: "confirmed",
      paymentStatus: "pending",
    };
  }
}

export async function processPayment(
  bookingId: string,
  data: {
    paymentMethod: string;
    useWalletBalance?: boolean;
  }
): Promise<{
  success: boolean;
  redirectUrl?: string;
}> {
  try {
    const response = await axios.post(
      `${API_URL}/bookings/${bookingId}/payment`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
}
