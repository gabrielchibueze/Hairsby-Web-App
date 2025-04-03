import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: "active" | "cancelled" | "expired";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  price: number;
  stripePriceId?: string;
  stripeSubscriptionId?: string;
  plan?: SubscriptionPlan;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: "month" | "year";
  features: any;
  limits: {
    bookingsPerMonth?: number;
    specialists?: number;
    locations?: number;
  };
  stripePriceId?: string;
  status: "active" | "inactive";
}

export interface Invoice {
  id: string;
  amountDue: number;
  amountPaid: number;
  currency: string;
  status: "paid" | "unpaid" | "void";
  created: number;
  pdfUrl: string;
}

export interface SubscribePayload {
  planId: string;
  paymentMethodId: string;
}

export interface UpdatePaymentMethodPayload {
  paymentMethodId: string;
}

export interface CreateSubscriptionPlanPayload {
  name: string;
  description?: string;
  price: number;
  interval: "month" | "year";
  features: Array<string>;
  limits: {
    bookingsPerMonth?: number;
    specialists?: number;
    locations?: number;
  };
}

export async function getCurrentSubscription() {
  try {
    const response = await axios.get(`${API_URL}/subscription/current`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching current subscription:", error);
    // Return dummy data if API fails
    return {
      plan: {
        id: "free",
        name: "Free Plan",
        price: 0,
        description:
          "Perfect for individuals starting their journey with our platform.",
        interval: "month",
        features: [
          "Basic booking management",
          "Simple calendar view",
          "Email notifications",
          "Single location only",
          "Basic customer profiles",
          "Standard support via email",
        ],
        limits: {
          bookingsPerMonth: 10,
          specialists: 0,
          locations: 1,
        },
      },
      status: "free",
      currentPeriodStart: null,
      currentPeriodEnd: null,
    };
  }
}

export async function subscribe(payload: SubscribePayload) {
  try {
    const response = await axios.post(
      `${API_URL}/subscription/subscribe`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error subscribing:", error);
    throw error;
  }
}

export async function cancelSubscription() {
  try {
    const response = await axios.post(`${API_URL}/subscription/cancel`);
    return response.data.data;
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    throw error;
  }
}

export async function getSubscriptionInvoices() {
  try {
    const response = await axios.get(`${API_URL}/subscription/invoices`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching subscription invoices:", error);
    // Return dummy data if API fails
    return [
      {
        id: "invoice-123",
        amountDue: 100.0,
        amountPaid: 100.0,
        currency: "usd",
        status: "paid",
        created: 1672531200,
        pdfUrl: "https://example.com/invoice.pdf",
      },
    ];
  }
}

export async function updatePaymentMethod(payload: UpdatePaymentMethodPayload) {
  try {
    const response = await axios.post(
      `${API_URL}/subscription/update-payment`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating payment method:", error);
    throw error;
  }
}

export async function getSubscriptionPlans() {
  try {
    const response = await axios.get(`${API_URL}/subscription/plans`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    // Return dummy data if API fails
    return [
      {
        id: "free",
        name: "Free Plan",
        price: 0,
        description:
          "Perfect for individuals starting their journey with our platform.",
        interval: "month",
        features: [
          "Basic booking management",
          "Simple calendar view",
          "Email notifications",
          "Single location only",
          "Basic customer profiles",
          "Standard support via email",
        ],
        limits: {
          bookingsPerMonth: 10,
          specialists: 0,
          locations: 1,
        },
      },
    ];
  }
}

export async function getFeatureMatrix() {
  try {
    const response = await axios.get(`${API_URL}/subscription/feature-matrix`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching subscription  plans feature matrix:", error);
    // Return dummy data if API fails
  }
}

// Admin routes
export async function createSubscriptionPlan(
  payload: CreateSubscriptionPlanPayload
) {
  try {
    const response = await axios.post(`${API_URL}/subscription/plans`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    throw error;
  }
}

export async function getSubscriptionPlanById(id: string) {
  try {
    const response = await axios.get(`${API_URL}/subscription/plans/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching subscription plan:", error);
    // Return dummy data if API fails
    return {
      id: "free",
      name: "Free Plan",
      price: 0,
      description:
        "Perfect for individuals starting their journey with our platform.",
      interval: "month",
      features: [
        "Basic booking management",
        "Simple calendar view",
        "Email notifications",
        "Single location only",
        "Basic customer profiles",
        "Standard support via email",
      ],
      limits: {
        bookingsPerMonth: 10,
        specialists: 0,
        locations: 1,
      },
    };
  }
}

export async function updateSubscriptionPlan(
  id: string,
  payload: CreateSubscriptionPlanPayload
) {
  try {
    const response = await axios.put(
      `${API_URL}/subscription/plans/${id}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating subscription plan:", error);
    throw error;
  }
}

export async function deleteSubscriptionPlan(id: string) {
  try {
    const response = await axios.delete(`${API_URL}/subscription/plans/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting subscription plan:", error);
    throw error;
  }
}
