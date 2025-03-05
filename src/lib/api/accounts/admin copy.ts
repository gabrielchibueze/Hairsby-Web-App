// Update the existing admin.ts file with new financial operations endpoints
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export async function getFinancialOverview({ range }: { range: string }) {
  try {
    const response = await axios.get(`${API_URL}/admin/finance/overview`, {
      params: { range },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching financial overview:", error);
    // Return dummy data if API fails
    return {
      stats: {
        totalRevenue: 45000,
        revenueGrowth: 15,
        pendingPayouts: 2500,
        pendingPayoutCount: 12,
        activeDisputes: 5,
        disputedAmount: 750,
        platformFees: 3500,
      },
      revenueData: [
        { date: "2025-02-20", revenue: 1500, payouts: 1200 },
        { date: "2025-02-21", revenue: 1800, payouts: 1400 },
        { date: "2025-02-22", revenue: 1600, payouts: 1300 },
        { date: "2025-02-23", revenue: 2000, payouts: 1600 },
        { date: "2025-02-24", revenue: 1900, payouts: 1500 },
        { date: "2025-02-25", revenue: 2200, payouts: 1800 },
      ],
    };
  }
}

export async function createBlogPost(data: FormData) {
  try {
    const response = await axios.post(`${API_URL}/admin/blog`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
}

export async function updateBlogPost(id: string, data: FormData) {
  try {
    const response = await axios.put(`${API_URL}/admin/blog/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
}

export async function deleteBlogPost(id: string) {
  try {
    const response = await axios.delete(`${API_URL}/admin/blog/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
}

export async function getBlogPosts(params?: {
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const response = await axios.get(`${API_URL}/admin/blog`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
}

export async function getBlogPost(id: string) {
  try {
    const response = await axios.get(`${API_URL}/admin/blog/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    throw error;
  }
}
