import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status:
    | "active"
    | "incomplete"
    | "ended"
    | "unpaid"
    | "cancelled"
    | "expired"
    | "overdue";
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
  currency?: string;
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

export interface PlanComparison {
  priceDifference: number;
  pricePercentageDifference: string;
  additionalFeatures: string[];
  missingFeatures: string[];
  commonFeatures: string[];
  bookings: {
    a: number;
    b: number;
    difference: number;
    percentage: string;
  };
  specialists: {
    a: number;
    b: number;
    difference: number;
  };
  locations: {
    a: number;
    b: number;
    difference: number;
  };
  isUpgrade: boolean;
  isDowngrade: boolean;
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
  paymentMethodId?: string | null;
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
    throw error;
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
    throw error;
  }
}

export async function changeSubscriptionPlan(payload: {
  newPlanId: string;
  paymentMethodId?: string | null;
}) {
  try {
    const response = await axios.post(
      `${API_URL}/subscription/change-plan`,
      payload
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function cancelSubscription() {
  try {
    const response = await axios.post(`${API_URL}/subscription/cancel`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function getSubscriptionInvoices() {
  try {
    const response = await axios.get(`${API_URL}/subscription/invoices`);
    return response.data.data;
  } catch (error) {
    throw error;
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
    throw error;
  }
}

export async function getSubscriptionPlans() {
  try {
    const response = await axios.get(`${API_URL}/subscription/plans`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function getFeatureMatrix() {
  try {
    const response = await axios.get(`${API_URL}/subscription/feature-matrix`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
export async function compareSubscriptionPlans(
  planA: string,
  planB: string
): Promise<PlanComparison> {
  const response = await axios.get<{ data: PlanComparison }>(
    `${API_URL}/subscription/compare-plans`,
    {
      params: { planAId: planA, planBId: planB },
    }
  );

  if (!response.data?.data) {
    throw new Error("Invalid response format from compare-plans endpoint");
  }

  return response.data.data;
}
// Admin routes
export async function createSubscriptionPlan(
  payload: CreateSubscriptionPlanPayload
) {
  try {
    const response = await axios.post(`${API_URL}/subscription/plans`, payload);
    return response.data.data;
  } catch (error) {
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
    throw error;
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
