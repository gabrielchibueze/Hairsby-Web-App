// lib/api/accounts/business.ts
import axios from "axios";
import { getSocket } from "@/lib/socket";
import {
  Provider,
  ProviderService,
  ProviderDashboard,
  ScheduleData,
} from "@/lib/api/accounts/provider";
import { Booking } from "@/lib/api/services/booking";
import { Order } from "@/lib/api/products/order";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface JobRole {
  id: string;
  name: string;
  description?: string;
  defaultPermissions: {
    manageProfile: boolean;
    manageBookings: boolean;
    manageServices: boolean;
    manageOrders: boolean;
    manageAvailability: boolean;
    viewReports: boolean;
    managePayments: boolean;
    manageSchedule: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SpecialistPermissions {
  manageProfile: boolean;
  manageBookings: boolean;
  manageServices: boolean;
  manageOrders: boolean;
  manageAvailability: boolean;
  viewReports: boolean;
  managePayments: boolean;
  manageSchedule: boolean;
}

export interface ProviderEmployee {
  id: string;
  businessId: string;
  specialistId: string;
  role: string;
  permissions: SpecialistPermissions;
  status: "pending" | "active" | "suspended" | "terminated";
  invitationToken?: string;
  invitationTokenExpiry?: string;
  joinedAt?: string;
  terminatedAt?: string;
  createdAt: string;
  updatedAt: string;
  specialist?: User;
  business?: User;
  jobRoles?: JobRole[];
  metrics?: {
    completedBookings: number;
    activeServices: number;
    totalOrders: number;
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  photo?: string;
  status?: string;
  businessName?: string;
  businessAddress?: string;
  city?: string;
  country?: string;
  createdAt?: string;
  lastSeen?: string;
}

export interface InviteSpecialistPayload {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  permissions?: Partial<SpecialistPermissions>;
  jobRoleIds?: string[];
}

export interface CompleteSpecialistSignupPayload {
  token: string;
  password: string;
}

export interface UpdateSpecialistPayload {
  permissions?: Partial<SpecialistPermissions>;
  role?: string;
  status?: "active" | "suspended" | "terminated";
  jobRoleIds?: string[];
}

// Specialist Management
export async function inviteSpecialist(
  payload: InviteSpecialistPayload
): Promise<ProviderEmployee> {
  try {
    const response = await axios.post(
      `${API_URL}/business/specialists/invite`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error inviting specialist:", error);
    throw error;
  }
}

export async function completeSpecialistSignup(
  payload: CompleteSpecialistSignupPayload
): Promise<void> {
  try {
    await axios.post(
      `${API_URL}/business/specialists/complete-signup`,
      payload
    );
  } catch (error) {
    console.error("Error completing specialist signup:", error);
    throw error;
  }
}

export async function getBusinessSpecialists(params?: {
  status?: "pending" | "active" | "suspended" | "terminated";
  search?: string;
}): Promise<ProviderEmployee[]> {
  try {
    const response = await axios.get(`${API_URL}/business/specialists`, {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching business specialists:", error);
    throw error;
  }
}

export async function getSpecialistDetails(
  specialistId: string
): Promise<ProviderEmployee> {
  try {
    const response = await axios.get(
      `${API_URL}/business/specialists/${specialistId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching specialist details:", error);
    throw error;
  }
}

export async function updateSpecialist(
  specialistId: string,
  payload: UpdateSpecialistPayload
): Promise<ProviderEmployee> {
  try {
    const response = await axios.put(
      `${API_URL}/business/specialists/${specialistId}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating specialist:", error);
    throw error;
  }
}

export async function removeSpecialist(specialistId: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/business/specialists/${specialistId}`);
  } catch (error) {
    console.error("Error removing specialist:", error);
    throw error;
  }
}

export async function getAssociatedBusinesses(): Promise<ProviderEmployee[]> {
  try {
    const response = await axios.get(`${API_URL}/business/my-businesses`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching associated businesses:", error);
    throw error;
  }
}

// Job Roles Management
export async function getJobRoles(): Promise<JobRole[]> {
  try {
    const response = await axios.get(`${API_URL}/business/job-roles`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching job roles:", error);
    throw error;
  }
}

// Specialist Schedule Management
export async function getSpecialistSchedule(
  specialistId: string
): Promise<ScheduleData> {
  try {
    const response = await axios.get(
      `${API_URL}/business/specialists/${specialistId}/schedule`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching specialist schedule:", error);
    throw error;
  }
}

export async function manageSpecialistSchedule(
  specialistId: string,
  data: ScheduleData
): Promise<ScheduleData> {
  try {
    const response = await axios.post(
      `${API_URL}/business/specialists/${specialistId}/schedule`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error managing specialist schedule:", error);
    throw error;
  }
}

// Specialist Services Management
export async function getSpecialistServices(
  specialistId: string,
  params?: {
    status?: "active" | "inactive";
    search?: string;
  }
): Promise<ProviderService[]> {
  try {
    const response = await axios.get(
      `${API_URL}/business/specialists/${specialistId}/services`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching specialist services:", error);
    throw error;
  }
}

// Specialist Bookings Management
export async function getSpecialistBookings(
  specialistId: string,
  params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<Booking[]> {
  try {
    const response = await axios.get(
      `${API_URL}/business/specialists/${specialistId}/bookings`,
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching specialist bookings:", error);
    throw error;
  }
}

export async function updateSpecialistBooking(
  specialistId: string,
  bookingId: string,
  data: {
    status?: string;
    notes?: string;
  }
): Promise<Booking> {
  try {
    const response = await axios.put(
      `${API_URL}/business/specialists/${specialistId}/bookings/${bookingId}`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating specialist booking:", error);
    throw error;
  }
}

// WebSocket subscriptions
export const subscribeToSpecialistUpdates = (
  callback: (specialist: ProviderEmployee) => void
) => {
  const socket = getSocket();
  socket.on("specialist_updated", callback);
  return () => socket.off("specialist_updated", callback);
};

export const subscribeToSpecialistInvitations = (
  callback: (specialist: ProviderEmployee) => void
) => {
  const socket = getSocket();
  socket.on("specialist_invited", callback);
  return () => socket.off("specialist_invited", callback);
};

export const subscribeToBookingUpdates = (
  callback: (booking: Booking) => void
) => {
  const socket = getSocket();
  socket.on("booking_updated", callback);
  return () => socket.off("booking_updated", callback);
};
