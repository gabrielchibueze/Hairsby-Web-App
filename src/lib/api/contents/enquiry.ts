import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

// Interface for Enquiry Data
export interface EnquiryData {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type?:
    | "general"
    | "support"
    | "technical"
    | "business"
    | "media"
    | "partnership"
    | "other";
  status?: "new" | "in_progress" | "responded" | "closed";
  response?: string;
  respondedBy?: string;
  respondedAt?: Date;
  metadata?: Record<string, any>;
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

// Create a new enquiry (public route)
export async function createEnquiry(enquiryData: EnquiryData): Promise<void> {
  try {
    await axios.post(`${API_URL}/enquiry`, enquiryData);
  } catch (error) {
    console.error("Error creating enquiry:", error);
    throw error;
  }
}

// Fetch all enquiries (protected route - admin only)
export async function getAllEnquiries(
  status?: string,
  type?: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginationResponse<EnquiryData>> {
  try {
    const response = await axios.get(`${API_URL}/enquiry`, {
      params: { status, type, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    throw error;
  }
}

// Fetch enquiry by ID (protected route - admin only)
export async function getEnquiryById(id: string): Promise<EnquiryData> {
  try {
    const response = await axios.get(`${API_URL}/enquiry/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching enquiry by ID:", error);
    throw error;
  }
}

// Respond to an enquiry (protected route - admin only)
export async function respondToEnquiry(
  id: string,
  response: string
): Promise<EnquiryData> {
  try {
    const responseData = await axios.put(`${API_URL}/enquiry/${id}/respond`, {
      response,
    });
    return responseData.data.data;
  } catch (error) {
    console.error("Error responding to enquiry:", error);
    throw error;
  }
}

// Update enquiry status (protected route - admin only)
export async function updateEnquiryStatus(
  id: string,
  status: "new" | "in_progress" | "responded" | "closed"
): Promise<EnquiryData> {
  try {
    const response = await axios.put(`${API_URL}/enquiry/${id}/status`, {
      status,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    throw error;
  }
}
