import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

// Interface for Dashboard Data
export interface DashboardData {
  totalUsers: number;
  totalCustomers: number;
  totalSpecialists: number;
  totalBusineses: number;
  totalAdmins: number;
  verifiedSpecialist: number;
  verifiedBusinesses: number;
  totalBookings: number;
  totalRevenue: number;
  totalActiveSubscriptions: number;
}

// Interface for User Data
export interface UserData {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  photo?: string;
  businessName?: string;
  address?: string;
  city?: string;
  country?: string;
  role?: "customer" | "specialist" | "business" | "admin";
  status?: "active" | "suspended";
  kycStatus?: "pending" | "in_review" | "approved" | "rejected";
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

// Interface for Pagination Response
export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

// Interface for Product Data
export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: "active" | "inactive" | "out_of_stock";
  providerId: string;
}

export interface ProductData {
  id: string;
  name: string;
  category: string;
  status: "active" | "inactive" | "out_of_stock";
  stock: number;
  brand: string;
  images: Array<string>;
  provider?: {
    id: string;
    photo: string;
    businessName: string;
    firstName: string;
    lastName: string;
  };
  metadata?: Record<string, any>;
}

// Interface for Payout Data
export interface PayoutData {
  id: string;
  providerId: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  paymentMethod: string;
  bankDetails: Record<string, any>;
}

// Interface for Subscription Plan Data
export interface SubscriptionPlanData {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: "month" | "year";
  features: Record<string, any>;
  limits: Record<string, any>;
  status: "active" | "inactive";
  stripePriceId: string;
}

// Interface for Revenue Data
export interface RevenueData {
  id: string;
  userId: string;
  source: "subscription" | "promotion" | "affiliate";
  amount: number;
  features: Record<string, any>;
}

// Fetch dashboard statistics (protected route - admin only)
export async function getDashboard(): Promise<DashboardData> {
  try {
    const response = await axios.get(`${API_URL}/admin/dashboard`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

// Fetch users (protected route - admin only)
export async function getUsers(
  role?: string,
  status?: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginationResponse<UserData>> {
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

// Update user status (protected route - admin only)
export async function updateUserStatus(
  id: string,
  status: "active" | "suspended"
): Promise<UserData> {
  try {
    const response = await axios.put(`${API_URL}/admin/users/${id}/status`, {
      status,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
}

// Suspend user account (protected route - admin only)
export async function suspendUserAccount(
  userId: string,
  reason: string
): Promise<void> {
  try {
    await axios.post(`${API_URL}/admin/account/suspend`, { userId, reason });
  } catch (error) {
    console.error("Error suspending account:", error);
    throw error;
  }
}

// Reactivate user account (protected route - admin only)
export async function reactivateUserAccount(
  userId: string,
  reason: string
): Promise<void> {
  try {
    await axios.post(`${API_URL}/admin/account/reactivate`, { userId, reason });
  } catch (error) {
    console.error("Error reactivating account:", error);
    throw error;
  }
}

// Fetch businesses (protected route - admin only)
export async function getBusinesses(
  status?: string,
  kycStatus?: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginationResponse<UserData>> {
  try {
    const response = await axios.get(`${API_URL}/admin/businesses`, {
      params: { status, kycStatus, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    throw error;
  }
}

// Fetch products (protected route - admin only)
export async function getProducts(
  category?: string,
  status?: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginationResponse<ProductData>> {
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

// Update product (protected route - admin only)
export async function updateProduct(
  id: string,
  productData: Partial<ProductData>
): Promise<ProductData> {
  try {
    const response = await axios.put(
      `${API_URL}/admin/products/${id}`,
      productData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

// Fetch payouts (protected route - admin only)
export async function getPayouts(
  status?: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginationResponse<PayoutData>> {
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

// Update payout status (protected route - admin only)
export async function updatePayout(
  id: string,
  status: "pending" | "processing" | "completed" | "failed"
): Promise<PayoutData> {
  try {
    const response = await axios.put(`${API_URL}/admin/payouts/${id}`, {
      status,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error updating payout:", error);
    throw error;
  }
}

// Fetch subscription plans (protected route - admin only)
export async function getSubscriptionPlans(
  page: number = 1,
  limit: number = 10
): Promise<PaginationResponse<SubscriptionPlanData>> {
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

// Create subscription plan (protected route - admin only)
export async function createSubscriptionPlan(
  planData: SubscriptionPlanData
): Promise<SubscriptionPlanData> {
  try {
    const response = await axios.post(
      `${API_URL}/admin/subscription-plans`,
      planData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    throw error;
  }
}

// Fetch subscription plan by ID (protected route - admin only)
export async function getSubscriptionPlanById(
  id: string
): Promise<SubscriptionPlanData> {
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

// Update subscription plan (protected route - admin only)
export async function updateSubscriptionPlan(
  id: string,
  planData: Partial<SubscriptionPlanData>
): Promise<SubscriptionPlanData> {
  try {
    const response = await axios.put(
      `${API_URL}/admin/subscription-plans/${id}`,
      planData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating subscription plan:", error);
    throw error;
  }
}

// Delete subscription plan (protected route - admin only)
export async function deleteSubscriptionPlan(id: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/admin/subscription-plans/${id}`, {});
  } catch (error) {
    console.error("Error deleting subscription plan:", error);
    throw error;
  }
}

// Fetch analytics (protected route - admin only)
export async function getAnalytics(
  startDate?: string,
  endDate?: string
): Promise<any> {
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

// Fetch revenues (protected route - admin only)
export async function getRevenues(
  source?: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginationResponse<RevenueData>> {
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

// Fetch revenue details by ID (protected route - admin only)
export async function getRevenueDetails(id: string): Promise<RevenueData> {
  try {
    const response = await axios.get(`${API_URL}/admin/revenue/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching revenue details:", error);
    throw error;
  }
}
