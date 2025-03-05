import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface DashboardData {
  users: number;
  customers: number;
  specialists: number;
  verifiedSpecialist: number;
  busineses: number;
  verifiedBusinesses: number;
  totalBookings: number;
  totalRevenue: number;
  totalActiveSubscriptions: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  email: string;
  role: string;
  status: string;
}

export interface Business {
  id: string;
  businessName: string;
  email: string;
  status: string;
  specialists: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  status: string;
  stock: number;
  brand: string;
  images: Array<string>;
  provider: {
    id: string;
    photo: string;
    businessName: string;
    firstName: string;
    lastName: string;
  };
}

export interface Payout {
  id: string;
  amount: number;
  status: string;
  provider: {
    id: string;
    businessName: string;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  limits: Record<string, number>;
  status: string;
}

export interface AnalyticsData {
  userStats: Array<{
    role: string;
    count: number;
    month: string;
  }>;
  bookingStats: Array<{
    status: string;
    count: number;
    month: string;
  }>;
  revenueStats: Array<{
    total: number;
    month: string;
  }>;
}

export interface Revenue {
  id: string;
  source: string;
  amount: number;
  createdAt: string;
}

export async function getDashboard(): Promise<DashboardData> {
  try {
    const response = await axios.get(`${API_URL}/admin/dashboard`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

export async function getUsers(
  role?: string,
  status?: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  users: User[];
  pagination: { total: number; page: number; totalPages: number };
}> {
  try {
    const response = await axios.get(`${API_URL}/admin/users`, {
      params: { role, status, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function updateUserStatus(id: string, status: string) {
  try {
    const response = await axios.put(`${API_URL}/admin/users/${id}/status`, {
      status,
    });
    2;
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
}

export async function suspendAccount(userId: string, reason: string) {
  try {
    const response = await axios.post(`${API_URL}/admin/account/suspend`, {
      userId,
      reason,
    });
    return response.data;
  } catch (error) {
    console.error("Error suspending account:", error);
    throw error;
  }
}

export async function getBusinesses(
  status?: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  businesses: Business[];
  pagination: { total: number; page: number; totalPages: number };
}> {
  try {
    const response = await axios.get(`${API_URL}/admin/businesses`, {
      params: { status, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    throw error;
  }
}

export async function getProducts(
  category?: string,
  status?: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  products: Product[];
  pagination: { total: number; page: number; totalPages: number };
}> {
  try {
    const response = await axios.get(`${API_URL}/admin/products`, {
      params: { category, status, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function updateProduct(id: string, data: Partial<Product>) {
  try {
    const response = await axios.put(`${API_URL}/admin/products/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function getPayouts(
  status?: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  payouts: Payout[];
  pagination: { total: number; page: number; totalPages: number };
}> {
  try {
    const response = await axios.get(`${API_URL}/admin/payouts`, {
      params: { status, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching payouts:", error);
    throw error;
  }
}

export async function updatePayout(id: string, status: string) {
  try {
    const response = await axios.put(`${API_URL}/admin/payouts/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating payout:", error);
    throw error;
  }
}

export async function getAnalytics(
  startDate?: string,
  endDate?: string
): Promise<AnalyticsData> {
  try {
    const response = await axios.get(`${API_URL}/admin/analytics`, {
      params: { startDate, endDate },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
}

export async function getSubscriptionPlans(
  page: number = 1,
  limit: number = 10
): Promise<{
  plans: SubscriptionPlan[];
  pagination: { total: number; page: number; totalPages: number };
}> {
  try {
    const response = await axios.get(`${API_URL}/admin/subscription-plans`, {
      params: { page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    throw error;
  }
}

export async function createSubscriptionPlan(data: {
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
  limits: Record<string, number>;
}) {
  try {
    const response = await axios.post(
      `${API_URL}/admin/subscription-plans`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    throw error;
  }
}

export async function getSubscriptionPlanById(
  id: string
): Promise<SubscriptionPlan> {
  try {
    const response = await axios.get(
      `${API_URL}/admin/subscription-plans/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching subscription plan by ID:", error);
    throw error;
  }
}

export async function updateSubscriptionPlan(
  id: string,
  data: Partial<SubscriptionPlan>
) {
  try {
    const response = await axios.put(
      `${API_URL}/admin/subscription-plans/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating subscription plan:", error);
    throw error;
  }
}

export async function deleteSubscriptionPlan(id: string) {
  try {
    const response = await axios.delete(
      `${API_URL}/admin/subscription-plans/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting subscription plan:", error);
    throw error;
  }
}

export async function getRevenues(
  source?: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  revenue: Revenue[];
  pagination: { total: number; page: number; totalPages: number };
}> {
  try {
    const response = await axios.get(`${API_URL}/admin/revenue`, {
      params: { source, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching revenues:", error);
    throw error;
  }
}

export async function getRevenueDetails(id: string): Promise<Revenue> {
  try {
    const response = await axios.get(`${API_URL}/admin/revenue/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching revenue details:", error);
    throw error;
  }
}
