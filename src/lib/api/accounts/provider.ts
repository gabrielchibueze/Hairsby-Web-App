import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

// Interfaces for the data structures
export interface Provider {
  id: string;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo: string;
  rating: number;
  address: string;
  city: string;
  country: string;
  gallery: {
    id: string;
    url: string;
    caption: string;
  }[];
  services: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface ProviderService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  images: string[];
  isAvailable: boolean;
  requiresAdvancePayment?: boolean;
  advancePaymentAmount?: number;
  advancePaymentType?: "fixed" | "percentage";
  cancellationPolicy: "flexible" | "moderate" | "strict";
}

export interface ProviderAppointment {
  id: string;
  date: string;
  time: string;
  service: {
    name: string;
    duration: number;
  };
  customer: {
    name: string;
    photo: string;
  };
  status: string;
}

export interface ProviderDashboard {
  stats: {
    todayAppointments: number;
    upcomingAppointments: number;
    totalRevenue: number;
    revenueIncrease: number;
    totalCustomers: number;
    newCustomers: number;
    averageRating: number;
    totalReviews: number;
  };
  appointments: ProviderAppointment[];
  reviews: Array<{
    id: string;
    customer: {
      name: string;
      photo: string;
    };
    rating: number;
    comment: string;
    date: string;
    service: string;
  }>;
  revenueData: Array<{
    date: string;
    revenue: number;
  }>;
  topServices: Array<{
    id: string;
    name: string;
    bookings: number;
    revenue: number;
  }>;
}

// Dashboard
export async function getProviderDashboard(): Promise<ProviderDashboard> {
  try {
    const response = await axios.get(`${API_URL}/provider/dashboard`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching provider dashboard:", error);
    throw error;
  }
}

export async function getProviderMetrics(params?: {
  startDate?: string;
  endDate?: string;
}) {
  try {
    const response = await axios.get(`${API_URL}/provider/metrics`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching provider metrics:", error);
    throw error;
  }
}

// Payment Settings
export async function getPaymentSettings() {
  try {
    const response = await axios.get(`${API_URL}/provider/payment/setting`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    throw error;
  }
}

export async function updatePaymentSettings(data: {
  acceptOnlinePayments: boolean;
  paymentType: "full" | "partial";
  partialPaymentPercentage?: number;
  escrowEnabled: boolean;
  escrowReleaseDays: number;
  paymentMethods: string[];
  bankDetails?: Record<string, unknown>;
}) {
  try {
    const response = await axios.put(
      `${API_URL}/provider/payment/setting`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating payment settings:", error);
    throw error;
  }
}

export async function connectStripeAccount() {
  try {
    const response = await axios.post(
      `${API_URL}/provider/payment/connect-stripe`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error connecting Stripe account:", error);
    throw error;
  }
}

export async function getStripeAccountStatus() {
  try {
    const response = await axios.get(
      `${API_URL}/provider/payment/stripe-status`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching Stripe account status:", error);
    throw error;
  }
}

// Service Management
export async function getProviderServices(params?: {
  search?: string;
  category?: string;
  type?: string;
  style?: string;
  minPrice?: number;
  maxPrice?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
}) {
  try {
    const response = await axios.get(`${API_URL}/provider/services`, {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching provider services:", error);
    throw error;
  }
}

export async function createService(data: FormData) {
  try {
    const response = await axios.post(`${API_URL}/provider/services`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

export async function updateService(id: string, data: FormData) {
  try {
    const response = await axios.put(
      `${API_URL}/provider/services/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

export async function deleteService(id: string) {
  try {
    const response = await axios.delete(`${API_URL}/provider/services/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
}

// Service Categories
export async function getServiceCategories(params?: {
  page?: number;
  limit?: number;
}) {
  try {
    const response = await axios.get(`${API_URL}/provider/categories`, {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching service categories:", error);
    throw error;
  }
}

// Service Packages
export async function getServicePackages(params?: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
}) {
  try {
    const response = await axios.get(`${API_URL}/provider/packages`, {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching service packages:", error);
    throw error;
  }
}

export async function createServicePackage(data: FormData) {
  try {
    const response = await axios.post(`${API_URL}/provider/packages`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating service package:", error);
    throw error;
  }
}

export async function updateServicePackage(id: string, data: FormData) {
  try {
    const response = await axios.put(
      `${API_URL}/provider/packages/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating service package:", error);
    throw error;
  }
}

export async function deleteServicePackage(id: string) {
  try {
    const response = await axios.delete(`${API_URL}/provider/packages/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting service package:", error);
    throw error;
  }
}

// Gallery Management
export async function getGallery() {
  try {
    const response = await axios.get(`${API_URL}/provider/gallery`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching gallery:", error);
    throw error;
  }
}

export async function addToGallery(data: FormData) {
  try {
    const response = await axios.post(`${API_URL}/provider/gallery`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error adding to gallery:", error);
    throw error;
  }
}

export async function updateGalleryPhoto(
  photoId: string,
  data: { caption: string }
) {
  try {
    const response = await axios.put(
      `${API_URL}/provider/gallery/${photoId}`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating gallery photo:", error);
    throw error;
  }
}

export async function removeFromGallery(photoId: string) {
  try {
    const response = await axios.delete(
      `${API_URL}/provider/gallery/${photoId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error removing from gallery:", error);
    throw error;
  }
}

// Schedule Management
export async function getProviderSchedule() {
  try {
    const response = await axios.get(`${API_URL}/provider/schedule`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching provider schedule:", error);
    throw error;
  }
}

export async function setProviderSchedule(data: {
  workingHours: Record<
    string,
    {
      start: string;
      end: string;
      breaks: Array<{ start: string; end: string }>;
    }
  >;
  unavailableDates: string[];
}) {
  try {
    const response = await axios.post(`${API_URL}/provider/schedule`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error setting provider schedule:", error);
    throw error;
  }
}

export async function setUnavailability(data: { dates: string[] }) {
  try {
    const response = await axios.post(
      `${API_URL}/provider/unavailability`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error setting unavailability:", error);
    throw error;
  }
}

// Business Management (Business only)
export async function getSpecialists() {
  try {
    const response = await axios.get(
      `${API_URL}/provider/business/specialists`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching specialists:", error);
    throw error;
  }
}

export async function inviteSpecialist(data: { email: string }) {
  try {
    const response = await axios.post(
      `${API_URL}/provider/business/specialists/onboard`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error inviting specialist:", error);
    throw error;
  }
}

export async function removeSpecialist(id: string) {
  try {
    const response = await axios.delete(
      `${API_URL}/provider/business/specialists/terminate/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error removing specialist:", error);
    throw error;
  }
}

// Specialist Management (Specialist only)
export async function disconnectFromBusiness() {
  try {
    const response = await axios.post(
      `${API_URL}/provider/specialist/disconnect`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error disconnecting from business:", error);
    throw error;
  }
}

// Earnings and Payouts
export async function getEarnings(params?: {
  startDate?: string;
  endDate?: string;
}) {
  try {
    const response = await axios.get(`${API_URL}/provider/earnings`, {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching earnings:", error);
    throw error;
  }
}

export async function getEarningsMetrics() {
  try {
    const response = await axios.get(`${API_URL}/provider/earnings/metrics`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching earnings metrics:", error);
    throw error;
  }
}

export async function requestPayout(data: {
  amount: number;
  paymentMethod: string;
  bankDetails: Record<string, unknown>;
}) {
  try {
    const response = await axios.post(
      `${API_URL}/provider/payouts/request`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error requesting payout:", error);
    throw error;
  }
}

export async function getPayouts() {
  try {
    const response = await axios.get(`${API_URL}/provider/payouts`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching payouts:", error);
    throw error;
  }
}

// Product Management
export async function getProviderProducts(params?: {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
  status?: string;
}) {
  try {
    const response = await axios.get(`${API_URL}/provider/products`, {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching provider products:", error);
    throw error;
  }
}

export async function createProduct(data: FormData) {
  try {
    const response = await axios.post(`${API_URL}/provider/products`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function updateProduct(id: string, data: FormData) {
  try {
    const response = await axios.put(
      `${API_URL}/provider/products/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    const response = await axios.delete(`${API_URL}/provider/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export async function updateProductStock(
  id: string,
  data: { stock: number; variantId?: string }
) {
  try {
    const response = await axios.put(
      `${API_URL}/provider/products/${id}/stock`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating product stock:", error);
    throw error;
  }
}

export async function getProductAnalytics(id: string) {
  try {
    const response = await axios.get(
      `${API_URL}/provider/products/${id}/analytics`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product analytics:", error);
    throw error;
  }
}

// Reviews
export async function getProviderReviews() {
  try {
    const response = await axios.get(`${API_URL}/provider/reviews`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching provider reviews:", error);
    throw error;
  }
}

export async function replyToReview(id: string, data: { reply: string }) {
  try {
    const response = await axios.post(
      `${API_URL}/provider/reviews/${id}/reply`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error replying to review:", error);
    throw error;
  }
}
