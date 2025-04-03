import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  trackingNumber?: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

export async function getOrders({ status }: { status?: string } = {}) {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      params: { status },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    // Return dummy data if API fails
    return [
      {
        id: "1",
        date: "2025-02-25",
        total: 75.0,
        status: "delivered",
        trackingNumber: "TRACK123",
        items: [
          {
            name: "Professional Shampoo",
            quantity: 2,
          },
        ],
      },
    ];
  }
}

export async function getOrderById(id: string) {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      id: "1",
      date: "2025-02-25",
      total: 75.0,
      status: "delivered",
      trackingNumber: "TRACK123",
      items: [
        {
          name: "Professional Shampoo",
          quantity: 2,
        },
      ],
    };
  }
}

export async function cancelOrder(id: string, reason: string) {
  try {
    const response = await axios.post(`${API_URL}/orders/${id}/cancel`, {
      reason,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
}
