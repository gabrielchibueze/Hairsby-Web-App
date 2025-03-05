import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface CheckoutSuccessResponse {
  orderId: string;
}

export interface CreateCheckoutSessionPayload {
  paymentMethod: "card" | "wallet";
  useWallet?: boolean;
}

export async function createCheckoutSession(
  payload: CreateCheckoutSessionPayload
) {
  try {
    const response = await axios.post(
      `${API_URL}/checkout/create-session`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

export async function handleCheckoutSuccess(sessionId: string) {
  try {
    const response = await axios.get(`${API_URL}/checkout/success`, {
      params: { session_id: sessionId },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error handling checkout success:", error);
    throw error;
  }
}
