import axios from "axios";
import { Booking } from "../services/booking";
import { Order } from "../products/order";
import { FavoriteProduct, FavoriteProvider, FavoriteService } from "./favorite";
import { ScheduleData } from "./provider";

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
  description?: string;
  businessName?: string;
  address?: string;
  businessAddress?: string;
  currency?: string;
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
  isBusinessBranch?: boolean;
  status: "active" | "suspended";
  isKycVerified?: boolean;
  kycStatus?: "pending" | "in_review" | "approved" | "rejected";
  kycLevel?: number;
  kycRejectionReason?: string;
  gallery?: Array<{ url: string; caption: string }>;
  stripeCustomerId?: string;
  stripeAccountId?: string;
  lastSeen?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  schedule?: ScheduleData;
  businessProfile?: {
    businessName?: string;
    businessEmail?: string;
    businessPhone?: string;
    businessAddress?: string;
    businessCity?: string;
    businessPostcode?: string;
    businessCountry?: string;
    businessType?: string;
    businessRegistrationNumber?: string;
  };
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

export interface NotificationPreferences {
  reminders: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  promotions: {
    email: boolean;
    push: boolean;
  };
  systemAlerts: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface ConsentRecord {
  type: string;
  accepted: boolean;
  timestamp: string;
  source?: string;
  userAgent?: string;
}

export interface ConsentPayload {
  type:
    | "privacy"
    | "cookies"
    | "marketing"
    | "terms"
    | "thirdPartySharing"
    | "dataRetention"
    | "locationTracking"
    | "notifications"
    | "analytics"
    | "personalization"
    | "smsMarketing";
  accepted: boolean;
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

export async function updateUserProfile(
  data: Partial<UserProfile>
): Promise<void> {
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
    formData.append("image", file);

    const response = await axios.post(
      `${API_URL}/account/profile/photo`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response);
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
    console.log("Payment methods", response.data.data);
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

// Notification Preferences
export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  try {
    const response = await axios.get(
      `${API_URL}/account/notifications/preferences`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    throw error;
  }
}

export async function updateNotificationPreferences(
  preferences: NotificationPreferences
): Promise<NotificationPreferences> {
  try {
    const response = await axios.put(
      `${API_URL}/account/notifications/preferences`,
      { preferences }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    throw error;
  }
}

// Consent Management
export async function updateConsent(data: ConsentPayload): Promise<void> {
  try {
    await axios.post(`${API_URL}/account/consent`, data);
  } catch (error) {
    console.error("Error updating consent:", error);
    throw error;
  }
}

export async function getConsentHistory(
  userId?: string
): Promise<ConsentRecord[]> {
  try {
    const response = await axios.get(
      `${API_URL}/account/consent/history?userId=${userId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching consent history:", error);
    throw error;
  }
}
