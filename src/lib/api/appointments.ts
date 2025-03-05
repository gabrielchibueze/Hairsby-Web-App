import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Appointment {
  id: string;
  date: string;
  time: string;
  service: {
    name: string;
    duration: number;
  };
  provider: {
    id: string;
    businessName: string;
    photo: string;
  };
  status: string;
  trackingNumber?: string;
}

export async function getAppointments({
  date,
  status,
}: { date?: Date; status?: string } = {}) {
  try {
    const response = await axios.get(`${API_URL}/bookings`, {
      params: {
        date: date?.toISOString(),
        status,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    // Return dummy data if API fails
    return [
      {
        id: "1",
        date: "2025-03-01",
        time: "10:00",
        service: {
          name: "Hair Styling",
          duration: 60,
        },
        provider: {
          id: "1",
          businessName: "Luxe Hair Studio",
          photo:
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1974&auto=format&fit=crop",
        },
        status: "confirmed",
      },
    ];
  }
}

export async function rescheduleAppointment(
  id: string,
  date: string,
  time: string
) {
  try {
    const response = await axios.put(`${API_URL}/bookings/${id}/reschedule`, {
      date,
      time,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    throw error;
  }
}

export async function cancelAppointment(id: string, reason: string) {
  try {
    const response = await axios.put(`${API_URL}/bookings/${id}/cancel`, {
      reason,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    throw error;
  }
}

export async function getAppointmentById(id: string) {
  try {
    const response = await axios.get(`${API_URL}/bookings/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error getting appointment:", error);
    return {
      id: "1",
      date: "2025-03-01",
      time: "10:00",
      service: {
        name: "Hair Styling",
        duration: 60,
      },
      provider: {
        id: "1",
        businessName: "Luxe Hair Studio",
        photo:
          "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1974&auto=format&fit=crop",
      },
      status: "confirmed",
    };
  }
}
