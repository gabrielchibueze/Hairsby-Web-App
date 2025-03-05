import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Order {
  id: string;
  customerId: string;
  providerId: string;
  status: string;
  orderCode: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  paymentReference?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }>;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  notes?: string;
  metadata?: any;
}

export interface CreateOrderPayload {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  notes?: string;
}

export interface UpdateOrderStatusPayload {
  status?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
}

export async function getOrders({
  status,
  orderCode,
  page = 1,
  limit = 10,
}: {
  status?: string;
  orderCode?: string;
  page?: number;
  limit?: number;
} = {}) {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      params: { status, orderCode, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    // Return dummy data if API fails
    return {
      orders: [
        {
          id: "1",
          customerId: "cust-123",
          providerId: "prov-456",
          status: "delivered",
          totalAmount: 75.0,
          orderCode: "ORD-00125",
          paymentStatus: "paid",
          paymentMethod: "card",
          shippingAddress: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "USA",
          },
          items: [
            {
              productId: "prod-789",
              quantity: 2,
              price: 37.5,
              name: "Professional Shampoo",
            },
          ],
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

export async function getOrderById(id: string) {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      id: "1",
      customerId: "cust-123",
      providerId: "prov-456",
      status: "delivered",
      totalAmount: 75.0,
      orderCode: "ORD-00125",
      paymentStatus: "paid",
      paymentMethod: "card",
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
      },
      items: [
        {
          productId: "prod-789",
          quantity: 2,
          price: 37.5,
          name: "Professional Shampoo",
        },
      ],
    };
  }
}

export async function createOrder(payload: CreateOrderPayload) {
  try {
    const response = await axios.post(`${API_URL}/orders`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
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

export async function updateOrderStatus(
  id: string,
  payload: UpdateOrderStatusPayload
) {
  try {
    const response = await axios.put(`${API_URL}/orders/${id}/status`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}
