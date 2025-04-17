import axios from "axios";
import { Booking } from "../services/booking";
import { Order } from "../products/order";
import { FavoriteProduct, FavoriteProvider, FavoriteService } from "./favorite";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo?: string;
  gender?: string;
  dob?: string;
  role: "customer" | "specialist" | "business" | "admin";
  businessName?: string;
  address?: string;
  businessAddress?: string;
  country?: string;
  city?: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  totalReviews?: number;
  typeOfService?: string[];
  referralCode?: string;
  referralCount?: number;
  referralRewards?: number;
  signupReward?: number;
  accentColor?: string;
  isEmailVerified?: boolean;
  status: "active" | "suspended";
  isKycVerified?: boolean;
  kycStatus?: "pending" | "in_review" | "approved" | "rejected";
  kycLevel?: number;
  kycRejectionReason?: string;
  gallery?: Array<{ url: string; caption: string }>;
  stripeCustomerId?: string;
  lastSeen?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Referral {
  id: string;
  referredId: string;
  status: string;
  reward: number;
  referred: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface PaymentMethod {
  id: string;
  type: string;
  isDefault?: boolean;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}
export interface UserDashboard {
  stats: {
    totalAppointments: number;
    upcomingAppointments: number;
    totalOrders: number;
    pendingOrders: number;
    walletBalance: number;
    recentTransactions: number;
    totalReviews: number;
    pendingReviews: number;
  };
  appointments: Booking[];
  orders: Order[];
  favorites?: {
    services: Array<FavoriteService>;
    products: Array<FavoriteProduct>;
    providers: Array<FavoriteProvider>;
  };
}

// Dashboard
export async function getUserDashboard(): Promise<UserDashboard> {
  try {
    const response = await axios.get(`${API_URL}/account/dashboard`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    throw error;
  }
}
// User Profile
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const response = await axios.get(`${API_URL}/account/profile`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}): Promise<UserProfile> {
  try {
    const response = await axios.post(
      `${API_URL}/account/profile/update`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export async function uploadUserProfilePhoto(
  file: File
): Promise<{ photoUrl: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${API_URL}/account/profile/photo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    throw error;
  }
}

// Change Password
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  try {
    await axios.post(`${API_URL}/account/change-password`, data);
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
}

// Delete Account
export async function deleteAccount(data: { reason: string }): Promise<void> {
  try {
    await axios.post(`${API_URL}/account/profile/delete`, data);
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
}

// Purchase History
export async function getPurchaseHistory(params?: {
  page?: number;
  limit?: number;
}): Promise<{
  purchases: Order[];
  pagination: { total: number; page: number; totalPages: number };
}> {
  try {
    const response = await axios.get(`${API_URL}/account/purchases`, {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    throw error;
  }
}

export async function getPurchaseDetails(id: string): Promise<Order> {
  try {
    const response = await axios.get(`${API_URL}/account/purchases/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching purchase details:", error);
    throw error;
  }
}

export async function downloadInvoice(id: string): Promise<Blob> {
  try {
    const response = await axios.get(
      `${API_URL}/account/purchases/${id}/invoice`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error downloading invoice:", error);
    throw error;
  }
}

// Booking History
export async function getBookingHistory(params?: {
  page?: number;
  limit?: number;
}): Promise<{
  bookings: Booking[];
  pagination: { total: number; page: number; totalPages: number };
}> {
  try {
    const response = await axios.get(`${API_URL}/account/booking`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching booking history:", error);
    throw error;
  }
}

export async function getBookingDetails(id: string): Promise<Booking> {
  try {
    const response = await axios.get(`${API_URL}/account/booking/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw error;
  }
}

export async function downloadBookingInvoice(id: string): Promise<Blob> {
  try {
    const response = await axios.get(
      `${API_URL}/account/booking/${id}/invoice`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error downloading booking invoice:", error);
    throw error;
  }
}

// Referrals
export async function getReferrals(): Promise<{
  referrals: Referral[];
  stats: {
    totalRewards: number;
    totalReferrals: number;
    completedReferrals: number;
  };
}> {
  try {
    const response = await axios.get(`${API_URL}/account/referrals`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching referrals:", error);
    throw error;
  }
}

export async function getReferralLink(): Promise<{
  referralCode: string;
  referralLink: string;
}> {
  try {
    const response = await axios.get(`${API_URL}/account/referrals/link`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching referral link:", error);
    throw error;
  }
}

export async function getReferralRewards(): Promise<{
  totalRewards: number;
  totalReferrals: number;
}> {
  try {
    const response = await axios.get(`${API_URL}/account/referrals/rewards`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching referral rewards:", error);
    throw error;
  }
}

// Reviews
export async function getCustomerReviews(): Promise<
  Array<{
    id: string;
    rating: number;
    comment: string;
    provider: {
      id: string;
      businessName: string;
    };
  }>
> {
  try {
    const response = await axios.get(`${API_URL}/account/reviews`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching customer reviews:", error);
    throw error;
  }
}

export async function getReviewDetails(id: string): Promise<{
  id: string;
  rating: number;
  comment: string;
  provider: {
    id: string;
    businessName: string;
  };
}> {
  try {
    const response = await axios.get(`${API_URL}/account/reviews/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching review details:", error);
    throw error;
  }
}

// Payment Methods
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    const response = await axios.get(`${API_URL}/account/payment-methods`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw error;
  }
}

export async function addPaymentMethod(data: {
  paymentMethodId: string;
}): Promise<void> {
  try {
    await axios.post(`${API_URL}/account/payment-methods`, data);
  } catch (error) {
    console.error("Error adding payment method:", error);
    throw error;
  }
}

export async function removePaymentMethod(id: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/account/payment-methods/${id}`);
  } catch (error) {
    console.error("Error removing payment method:", error);
    throw error;
  }
}

export async function setDefaultPaymentMethod(id: string): Promise<void> {
  try {
    await axios.put(`${API_URL}/account/payment-methods/${id}/default`);
  } catch (error) {
    console.error("Error setting default payment method:", error);
    throw error;
  }
}
