import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

// Interface for FAQ Data
export interface FAQData {
  id?: string;
  title: string;
  content: string;
  type: "general" | "payments" | "products" | "services";
  category?: string;
  tags?: string[];
  status?: "draft" | "published" | "archived";
  metadata?: Record<string, any>;
  slug?: string;
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

// Fetch all FAQs (public route)
export async function getFaqs(
  category?: string,
  page: number = 1,
  limit: number = 10,
  query?: string
): Promise<PaginationResponse<FAQData>> {
  try {
    const response = await axios.get(`${API_URL}/faq`, {
      params: { category, page, limit, query },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }
}

// Fetch FAQs by category (public route)
export async function getFaqsByCategory(category: string): Promise<FAQData[]> {
  try {
    const response = await axios.get(`${API_URL}/faq/category`, {
      params: { category },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching FAQs by category:", error);
    throw error;
  }
}

// Fetch FAQ categories (public route)
export async function getFaqCategories(): Promise<string[]> {
  try {
    const response = await axios.get(`${API_URL}/faq/categories`);
    return response.data.data.categories;
  } catch (error) {
    console.error("Error fetching FAQ categories:", error);
    throw error;
  }
}

// Create a new FAQ (protected route - admin only)
export async function createFaq(faqData: FAQData): Promise<FAQData> {
  try {
    const response = await axios.post(`${API_URL}/faq`, faqData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating FAQ:", error);
    throw error;
  }
}

// Update an existing FAQ (protected route - admin only)
export async function updateFaq(
  id: string,
  faqData: Partial<FAQData>
): Promise<FAQData> {
  try {
    const response = await axios.put(`${API_URL}/faq/${id}`, faqData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating FAQ:", error);
    throw error;
  }
}

// Delete an FAQ (protected route - admin only)
export async function deleteFaq(id: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/faq/${id}`);
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    throw error;
  }
}

// Update FAQ status (protected route - admin only)
export async function updateFaqStatus(
  id: string,
  status: "draft" | "published" | "archived"
): Promise<FAQData> {
  try {
    const response = await axios.put(`${API_URL}/faq/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    console.error("Error updating FAQ status:", error);
    throw error;
  }
}
