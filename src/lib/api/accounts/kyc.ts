import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface KYC {
  id: string;
  userId: string;
  type: "specialist" | "business";
  status: "pending" | "in_review" | "approved" | "rejected";
  documents: Array<{ url: string; type: string }>;
  verificationDetails: Record<string, any>;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export interface KYCPagination {
  total: number;
  page: number;
  totalPages: number;
}

// ==================== User Routes ====================

/**
 * Submit KYC documents for verification.
 * @param {FormData} formData - The form data containing KYC documents and details.
 * @returns {Promise<KYC>} - The submitted KYC application.
 */
export async function submitKYC(formData: FormData): Promise<KYC> {
  try {
    const response = await axios.post(`${API_URL}/kyc/submit`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error submitting KYC:", error);
    throw error;
  }
}

/**
 * Fetch the current user's KYC status.
 * @returns {Promise<KYC>} - The KYC status and details.
 */
export async function getKYCStatus(): Promise<KYC> {
  try {
    const response = await axios.get(`${API_URL}/kyc/status`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching KYC status:", error);
    throw error;
  }
}

/**
 * Update the current user's KYC details.
 * @param {FormData} formData - The form data containing updated KYC documents and details.
 * @returns {Promise<KYC>} - The updated KYC application.
 */
export async function updateKYC(formData: FormData): Promise<KYC> {
  try {
    const response = await axios.put(`${API_URL}/kyc/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error updating KYC:", error);
    throw error;
  }
}

// ==================== Admin Routes ====================

/**
 * Fetch all pending KYC applications (admin only).
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<{ kyc: KYC[]; pagination: KYCPagination }>} - List of pending KYC applications and pagination details.
 */
export async function getPendingKYC(
  page: number = 1,
  limit: number = 10
): Promise<{ kyc: KYC[]; pagination: KYCPagination }> {
  try {
    const response = await axios.get(`${API_URL}/kyc/pending`, {
      params: { page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching pending KYC:", error);
    return { kyc: [], pagination: { total: 0, page: 1, totalPages: 1 } };
  }
}

/**
 * Fetch all KYC applications (admin only).
 * @param {string} status - Optional filter by status.
 * @param {string} type - Optional filter by type.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<{ kyc: KYC[]; pagination: KYCPagination }>} - List of KYC applications and pagination details.
 */
export async function getAllKYC(
  status?: string,
  type?: string,
  page: number = 1,
  limit: number = 10
): Promise<{ kyc: KYC[]; pagination: KYCPagination }> {
  try {
    const response = await axios.get(`${API_URL}/kyc/all`, {
      params: { status, type, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all KYC:", error);
    return { kyc: [], pagination: { total: 0, page: 1, totalPages: 1 } };
  }
}

/**
 * Review a KYC application (admin only).
 * @param {string} kycId - The ID of the KYC application.
 * @param {string} status - The new status ('approved' or 'rejected').
 * @param {string} rejectionReason - Optional reason for rejection.
 * @returns {Promise<KYC>} - The reviewed KYC application.
 */
export async function reviewKYC(
  kycId: string,
  status: "approved" | "rejected" | "in_review",
  rejectionReason?: string
): Promise<KYC> {
  try {
    const response = await axios.put(`${API_URL}/kyc/${kycId}/review`, {
      status,
      rejectionReason,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error reviewing KYC:", error);
    throw error;
  }
}
