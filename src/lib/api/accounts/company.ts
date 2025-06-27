// lib/api/accounts/company.ts
import axios from "axios";
import { Service } from "../services/service";
import { Product } from "../products/product";
import { Order } from "../products/order";
import { Booking } from "../services/booking";
import { ScheduleData } from "./provider";
import { UserProfile } from "./profile";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface BusinessBranch {
  id: string;
  parentBusinessId: string;
  branchId: string;
  branchName: string;
  branchCode: string;
  permissions: {
    manageEmployees?: boolean;
    manageServices?: boolean;
    manageProducts?: boolean;
    manageBookings?: boolean;
    manageOrders?: boolean;
    manageGallery?: boolean;
    manageProfile?: boolean;
    manageAvailability?: boolean;
    viewReports?: boolean;
    managePayments?: boolean;
    manageBranchSettings?: boolean;
    manageBranchLocations?: boolean;
  };
  status: "active" | "suspended" | "pending_setup";
  isPrimaryBranch: boolean;
  branch: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    country?: string;
    postcode?: string;
    businessName: string;
    photo?: string;
    rating?: number;
    totalReviews?: number;
    schedule?: ScheduleData;
    services?: Service[];
    products?: Product[];
    orders?: Order[];
    bookings?: Booking[];
  };
  parentBusiness: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    businessName: string;
    photo?: string;
  };
}

export interface BranchCreationPayload {
  email: string;
  branchName: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  postcode?: string;
  permissions?: BusinessBranch["permissions"];
}

export interface BranchUpdatePayload {
  branchName?: string;
  permissions?: BusinessBranch["permissions"];
  status?: BusinessBranch["status"];
  profile?: Partial<UserProfile>;
}

// Branch Management
export async function createBranch(
  data: BranchCreationPayload
): Promise<BusinessBranch> {
  try {
    const response = await axios.post(`${API_URL}/company/branches`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating branch:", error);
    throw error;
  }
}

export async function getBusinessBranches(): Promise<BusinessBranch[]> {
  try {
    const response = await axios.get(`${API_URL}/company/branches`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching branches:", error);
    throw error;
  }
}

export async function getBusinessBranchDetails(
  branchId: string
): Promise<BusinessBranch> {
  try {
    const response = await axios.get(`${API_URL}/company/branches/${branchId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching branch details:", error);
    throw error;
  }
}

export async function updateBranch(
  branchId: string,
  data: BranchUpdatePayload
): Promise<BusinessBranch> {
  try {
    const response = await axios.put(
      `${API_URL}/company/branches/${branchId}`,
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating branch:", error);
    throw error;
  }
}

export async function deleteBranch(
  branchId: string,
  reason?: string
): Promise<void> {
  try {
    await axios.delete(`${API_URL}/company/branches/${branchId}`, {
      data: { reason },
    });
  } catch (error) {
    console.error("Error deleting branch:", error);
    throw error;
  }
}

// My Branch (for branch accounts)
export async function getMyBranchDetails(): Promise<BusinessBranch> {
  try {
    const response = await axios.get(`${API_URL}/company/my-branch`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching my branch details:", error);
    throw error;
  }
}

export async function updateMyBranch(
  data: BranchUpdatePayload
): Promise<BusinessBranch> {
  try {
    const response = await axios.put(`${API_URL}/company/my-branch`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating my branch:", error);
    throw error;
  }
}

// Branch Services
export async function getBranchServices(branchId: string): Promise<Service[]> {
  try {
    const response = await axios.get(
      `${API_URL}/company/branches/${branchId}/services`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching branch services:", error);
    throw error;
  }
}

export async function createBranchService(
  branchId: string,
  serviceData: FormData
): Promise<Service> {
  try {
    const response = await axios.post(
      `${API_URL}/company/branches/${branchId}/services`,
      serviceData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating branch service:", error);
    throw error;
  }
}

export async function updateBranchService(
  branchId: string,
  serviceId: string,
  serviceData: FormData
): Promise<Service> {
  try {
    const response = await axios.put(
      `${API_URL}/company/branches/${branchId}/services/${serviceId}`,
      serviceData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating branch service:", error);
    throw error;
  }
}

export async function deleteBranchService(
  branchId: string,
  serviceId: string
): Promise<void> {
  try {
    await axios.delete(
      `${API_URL}/company/branches/${branchId}/services/${serviceId}`
    );
  } catch (error) {
    console.error("Error deleting branch service:", error);
    throw error;
  }
}

// Branch Products
export async function getBranchProducts(branchId: string): Promise<Product[]> {
  try {
    const response = await axios.get(
      `${API_URL}/company/branches/${branchId}/products`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching branch products:", error);
    throw error;
  }
}

export async function createBranchProduct(
  branchId: string,
  productData: FormData
): Promise<Product> {
  try {
    const response = await axios.post(
      `${API_URL}/company/branches/${branchId}/products`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating branch product:", error);
    throw error;
  }
}

export async function updateBranchProduct(
  branchId: string,
  productId: string,
  productData: FormData
): Promise<Product> {
  try {
    const response = await axios.put(
      `${API_URL}/company/branches/${branchId}/products/${productId}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating branch product:", error);
    throw error;
  }
}

export async function deleteBranchProduct(
  branchId: string,
  productId: string
): Promise<void> {
  try {
    await axios.delete(
      `${API_URL}/company/branches/${branchId}/products/${productId}`
    );
  } catch (error) {
    console.error("Error deleting branch product:", error);
    throw error;
  }
}

// Branch Bookings
export async function getBranchBookings(branchId: string): Promise<Booking[]> {
  try {
    const response = await axios.get(
      `${API_URL}/company/branches/${branchId}/bookings`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching branch bookings:", error);
    throw error;
  }
}

export async function updateBranchBooking(
  branchId: string,
  bookingId: string,
  bookingData: Partial<Booking>
): Promise<Booking> {
  try {
    const response = await axios.put(
      `${API_URL}/company/branches/${branchId}/bookings/${bookingId}`,
      bookingData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating branch booking:", error);
    throw error;
  }
}

// Branch Orders
export async function getBranchOrders(branchId: string): Promise<Order[]> {
  try {
    const response = await axios.get(
      `${API_URL}/company/branches/${branchId}/orders`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching branch orders:", error);
    throw error;
  }
}

export async function updateBranchOrder(
  branchId: string,
  orderId: string,
  orderData: Partial<Order>
): Promise<Order> {
  try {
    const response = await axios.put(
      `${API_URL}/company/branches/${branchId}/orders/${orderId}`,
      orderData
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating branch order:", error);
    throw error;
  }
}

// Branch Setup
export async function validateBranchToken(token: string): Promise<{
  success: boolean;
  data: {
    branchName: string;
    businessName: string;
    email: string;
    businessDetails: {
      phone: string;
      address: string;
      city: string;
      country: string;
      postcode: string;
      description?: string;
      typeOfService?: string[];
    };
  };
}> {
  try {
    const response = await axios.get(
      `${API_URL}/company/onboarding/business-branch/validate-token?token=${token}`
    );
    return response.data;
  } catch (error) {
    console.error("Error validating branch token:", error);
    throw error;
  }
}

export interface BranchSetupPayload {
  password: string;
  businessDetails: {
    phone: string;
    address: string;
    city: string;
    country: string;
    postcode: string;
    description?: string;
    typeOfService?: string[];
  };
}

export async function completeBranchSetup(
  token: string,
  payload: BranchSetupPayload
): Promise<BusinessBranch> {
  try {
    const response = await axios.post(
      `${API_URL}/company/onboarding/business-branch/setup?token=${token}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error completing branch setup:", error);
    throw error;
  }
}
