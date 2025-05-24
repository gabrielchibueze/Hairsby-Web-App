import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Order {
  id: string | any;
  customerId: string;
  providerId: string;
  status: string;
  orderCode: string;
  totalAmount: number;
  paidAmount: number | 0;
  orderType: "pickup" | "delivery";
  paymentStatus: string;
  paymentMethod: string;
  paymentReference?: string;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    businessName?: string;
    phone?: string;
    email?: string;
    photo?: string;
  };
  provider?: {
    id: string;
    firstName: string;
    lastName: string;
    businessName?: string;
    photo?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    country?: string;
    postcode?: string;
    longitude?: number;
    latitude?: number;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    address?: string;
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
  createdAt?: string;
  updatedAt?: string;
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

export interface ProcessOrderPaymentPayload {
  paymentMethod: string;
  paymentAmount?: number;
}

export interface RefundOrderPayload {
  amount: number;
  reason: string;
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

export async function updateOrder(
  id: string,
  payload: {
    shippingAddress?: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    notes?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: string;
  }
) {
  try {
    const response = await axios.put(`${API_URL}/orders/${id}/update`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}

export async function processOrderPayment(
  id: string,
  payload: ProcessOrderPaymentPayload
) {
  try {
    const response = await axios.put(
      `${API_URL}/orders/${id}/payment`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error processing order payment:", error);
    throw error;
  }
}

export async function refundOrderPayment(
  id: string,
  payload: RefundOrderPayload
) {
  try {
    const response = await axios.post(
      `${API_URL}/orders/${id}/refund`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error refunding order payment:", error);
    throw error;
  }
}
