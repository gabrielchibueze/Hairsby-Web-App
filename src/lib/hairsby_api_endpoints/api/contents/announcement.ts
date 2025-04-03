import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

// Interface for Announcement Data
export interface AnnouncementData {
  id?: string;
  title: string;
  content: string;
  type: "general" | "customer" | "specialist" | "business" | "admin";
  status?: "draft" | "published" | "archived";
  category?: string;
  tags?: string[];
  files?: { url: string; type: string }[];
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

// Fetch all announcements (public route)
export async function getAnnouncements(
  page: number = 1,
  limit: number = 10,
  query?: string,
  category?: string
): Promise<PaginationResponse<AnnouncementData>> {
  try {
    const response = await axios.get(`${API_URL}/announcement`, {
      params: { page, limit, query, category },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    throw error;
  }
}

// Fetch announcement by ID (public route)
export async function getAnnouncementById(
  id: string
): Promise<AnnouncementData> {
  try {
    const response = await axios.get(`${API_URL}/announcement/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching announcement by ID:", error);
    throw error;
  }
}

// Create a new announcement (protected route - admin only)
export async function createAnnouncement(
  announcementData: AnnouncementData,
  files: File[]
): Promise<AnnouncementData> {
  try {
    const formData = new FormData();
    formData.append("title", announcementData.title);
    formData.append("content", announcementData.content);
    formData.append("type", announcementData.type);
    formData.append("category", announcementData.category || "");
    formData.append("tags", JSON.stringify(announcementData.tags || []));
    formData.append("status", announcementData.status || "draft");
    files.forEach((file) => formData.append("files", file));

    const response = await axios.post(`${API_URL}/announcement`, formData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
}

// Update an existing announcement (protected route - admin only)
export async function updateAnnouncement(
  id: string,
  announcementData: AnnouncementData,
  files: File[] = [],
  removedFiles: string[] = []
): Promise<AnnouncementData> {
  try {
    const formData = new FormData();
    formData.append("title", announcementData.title);
    formData.append("content", announcementData.content);
    formData.append("type", announcementData.type);
    formData.append("category", announcementData.category || "");
    formData.append("tags", JSON.stringify(announcementData.tags || []));
    formData.append("status", announcementData.status || "draft");
    formData.append("removedFiles", JSON.stringify(removedFiles));
    files.forEach((file) => formData.append("files", file));

    const response = await axios.put(`${API_URL}/announcement/${id}`, formData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
}

// Delete an announcement (protected route - admin only)
export async function deleteAnnouncement(id: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/announcement/${id}`);
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
}

// Update announcement status (protected route - admin only)
export async function updateAnnouncementStatus(
  id: string,
  status: "draft" | "published" | "archived"
): Promise<AnnouncementData> {
  try {
    const response = await axios.put(`${API_URL}/announcement/${id}/status`, {
      status,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error updating announcement status:", error);
    throw error;
  }
}
