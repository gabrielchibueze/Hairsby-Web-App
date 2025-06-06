// lib/api/accounts/business.ts
import axios from "axios";
import { ProviderService, ScheduleData } from "./provider";
import { Order } from "../products/order";
import { Booking } from "../services/booking";
import { Product } from "../products/product";
import { Service } from "../services/service";
import { string } from "zod";
import { UserProfile } from "./profile";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";
export type employmentStatus = "active" | "on_leave" | "terminated" | "pending";
export type PermissionName =
  | "manageSchedule"
  | "manageServices"
  | "manageProducts"
  | "manageBookings"
  | "manageOrders"
  | "manageGallery"
  | "manageProfile"
  | "manageAvailability"
  | "viewReports"
  | "managePayments";

export interface employeePermissions {
  manageSchedule?: boolean;
  manageServices?: boolean;
  manageProducts?: boolean;
  manageBookings?: boolean;
  manageOrders?: boolean;
  manageGallery?: boolean;
  manageProfile?: boolean;
  manageAvailability?: boolean;
  viewReports?: boolean;
  managePayments?: boolean;
}
export interface BusinessEmployee {
  id: string;
  employeeId: string;
  businessId: string;
  role: Array<string>;
  permissions: employeePermissions;
  employmentStatus: employmentStatus;
  joinedAt: string;
  terminatedAt?: string;
  terminationReason?: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    dob?: string;
    email: string;
    phone: string;
    photo: string;
    rating: number;
    businessName?: string;
    address?: string;
    city?: string;
    country?: string;
    postcode?: string;
    totalReviews: number;
    schedule?: ScheduleData;
    bookings?: Booking[];
    services?: Service[];
    orders?: Order[];
    products?: Product[];
  };
  business: {
    id: string;
    firstName: string;
    lastName: string;
    businessName?: string;
    dob?: string;
    email: string;
    phone: string;
    photo: string;
    rating: number;
    address?: string;
    city?: string;
    country?: string;
    postcode?: string;
    totalReviews: number;
    schedule?: ScheduleData;
    bookings?: Booking[];
    services?: Service[];
    orders?: Order[];
    products?: Product[];
  };
}

export interface EmployeeInvitationPayload {
  email: string;
  firstName: string;
  lastName: string;
  role: Array<string>;
  permissions?: employeePermissions;
}

// lib/api/accounts/business.ts
interface EmployeeUpdatePayload {
  role?: string[];
  permissions?: employeePermissions;
  employmentStatus?: employmentStatus;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dob?: string | null;
    address?: string;
    city?: string;
    country?: string;
    postcode?: string;
  };
}

// Employee Management
export async function inviteEmployee(
  data: EmployeeInvitationPayload
): Promise<BusinessEmployee> {
  try {
    const response = await axios.post(
      `${API_URL}/business/employees/invite`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error inviting employee:", error);
    throw error;
  }
}

export async function getBusinessEmployeeOrganisations(): Promise<
  BusinessEmployee[]
> {
  try {
    const response = await axios.get(`${API_URL}/business/organisations`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
}

export async function getBusinessEmployeeDetails(
  businessEmployeeId: string
): Promise<BusinessEmployee> {
  try {
    const response = await axios.get(
      `${API_URL}/business/organisations/${businessEmployeeId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching employee details:", error);
    throw error;
  }
}

export async function updateEmployee(
  employeeId: string,
  data: EmployeeUpdatePayload
): Promise<BusinessEmployee> {
  try {
    const response = await axios.put(
      `${API_URL}/business/employees/${employeeId}`,
      data
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update employee"
      );
    }
    console.error("Error updating employee:", error);
    throw new Error("Failed to update employee");
  }
}

export async function terminateEmployee(
  employeeId: string,
  reason: string
): Promise<void> {
  console.log(employeeId, reason);
  try {
    await axios.delete(
      `${API_URL}/business/employees/${employeeId}/terminate`,
      {
        data: { reason },
      }
    );
  } catch (error) {
    console.error("Error terminating employee:", error);
    throw error;
  }
}
export async function disconnectFromBusiness(
  businessId: string,
  reason: string
): Promise<void> {
  try {
    await axios.delete(
      `${API_URL}/business/organisation/${businessId}/disconnect`,
      {
        data: { reason },
      }
    );
  } catch (error) {
    console.error("Error disconnecting from business", error);
    throw error;
  }
}

//Business update Employee Schedule
export async function updateEmployeeSchedule(
  employeeId: string,
  scheduleData: ScheduleData
): Promise<ScheduleData> {
  try {
    const response = await axios.put(
      `${API_URL}/business/employees/${employeeId}/schedule`,
      scheduleData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating employee schedule:", error);
    throw error;
  }
}

// Employee Service Management
export async function getBusinessEmployeeServices(
  employeeId: string,
  businessId: string
): Promise<Service[]> {
  try {
    const response = await axios.get(
      `${API_URL}/business/management/services?businessId=${businessId}&employeeId=${employeeId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching employee services:", error);
    throw error;
  }
}

export async function createBusinessEmployeeService(
  employeeId: string,
  businessId: string,
  serviceData: FormData
): Promise<ProviderService> {
  try {
    const response = await axios.post(
      `${API_URL}/business/management/services?businessId=${businessId}&employeeId=${employeeId}`,
      serviceData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating employee service:", error);
    throw error;
  }
}

export async function updateBusinessEmployeeService(
  employeeId: string,
  businessId: string,
  serviceId: string,
  serviceData: FormData
): Promise<ProviderService> {
  try {
    const response = await axios.put(
      `${API_URL}/business/management/services/${serviceId}?businessId=${businessId}&employeeId=${employeeId}`,
      serviceData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating employee service:", error);
    throw error;
  }
}

export async function deleteBusinessEmployeeService(
  employeeId: string,
  businessId: string,
  serviceId: string
): Promise<void> {
  try {
    await axios.delete(
      `${API_URL}/business/management/services/${serviceId}?businessId=${businessId}&employeeId=${employeeId}`
    );
  } catch (error) {
    console.error("Error deleting employee service:", error);
    throw error;
  }
}

// Employee Product Management
export async function getBusinessEmployeeProducts(
  employeeId: string,
  businessId: string
): Promise<Product[]> {
  try {
    const response = await axios.get(
      `${API_URL}/business/management/products?businessId=${businessId}&employeeId=${employeeId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching employee products:", error);
    throw error;
  }
}

export async function createBusinessEmployeeProduct(
  employeeId: string,
  businessId: string,
  productData: FormData
): Promise<Product> {
  try {
    const response = await axios.post(
      `${API_URL}/business/management/products?businessId=${businessId}&employeeId=${employeeId}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating employee product:", error);
    throw error;
  }
}

export async function updateBusinessEmployeeProduct(
  employeeId: string,
  businessId: string,
  productId: string,
  productData: FormData
): Promise<Product> {
  try {
    const response = await axios.put(
      `${API_URL}/business/management/products/${productId}?businessId=${businessId}&employeeId=${employeeId}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating employee product:", error);
    throw error;
  }
}

export async function deleteBusinessEmployeeProduct(
  employeeId: string,
  businessId: string,
  productId: string
): Promise<void> {
  try {
    await axios.delete(
      `${API_URL}/business/management/products/${productId}?businessId=${businessId}&employeeId=${employeeId}`
    );
  } catch (error) {
    console.error("Error deleting employee product:", error);
    throw error;
  }
}

// Employee Booking Management
export async function getBusinessEmployeeBookings(
  employeeId: string,
  businessId: string
): Promise<Booking[]> {
  try {
    const response = await axios.get(
      `${API_URL}/business/management/bookings/?businessId=${businessId}&employeeId=${employeeId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching employee bookings:", error);
    throw error;
  }
}

export async function updateBusinessEmployeeBooking(
  employeeId: string,
  businessId: string,
  bookingId: string,
  bookingData: Partial<Booking>
): Promise<Booking> {
  try {
    const response = await axios.put(
      `${API_URL}/business/management/bookings/${bookingId}?businessId=${businessId}&employeeId=${employeeId}`,
      bookingData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating employee booking:", error);
    throw error;
  }
}

// Employee Order Management
export async function getBusinessEmployeeOrders(
  employeeId: string,
  businessId: string
): Promise<Order[]> {
  try {
    const response = await axios.get(
      `${API_URL}/business/management/orders?businessId=${businessId}&employeeId=${employeeId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching employee orders:", error);
    throw error;
  }
}

export async function updateBusinessEmployeeOrder(
  employeeId: string,
  businessId: string,
  orderId: string,
  orderData: Partial<Order>
): Promise<Order> {
  try {
    const response = await axios.put(
      `${API_URL}/business/management/orders/${orderId}?businessId=${businessId}&employeeId=${employeeId}`,
      orderData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating employee order:", error);
    throw error;
  }
}

// Validate Specialist/employee onboarding token
interface onboardTokenResponse {
  success: boolean;
  data: {
    firstName: string;
    lastName: string;
    email: string;
    businessName: string;
  };
}
export async function validateSpecialistOnboardingToken(
  token: string
): Promise<onboardTokenResponse> {
  try {
    const response = await axios.get(
      `${API_URL}/business/specialist/onboarding?token=${token}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
export interface onboardingPayload {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dob: string;
  typeOfService?: string[];
  description: string;
  address: string;
  country: string;
  city: string;
  postcode: string;
  longitude?: number;
  latitude?: number;
}

export async function completeSpecialistOnboarding(
  token: string,
  payload: onboardingPayload
) {
  try {
    const response = await axios.post(
      `${API_URL}/business/specialist/onboarding?token=${token}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating employee order:", error);
    throw error;
  }
}
