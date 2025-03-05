import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

// Interface for Blog Data
export interface BlogData {
  id?: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  type: "blog" | "press";
  files?: { url: string; type: string }[];
  status?: "draft" | "published" | "archived";
  author?: {
    id: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
  createdAt?: string;
  updatedAt?: String;
  readTime?: string;
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

// Fetch all blogs (public route)
export async function getBlogs(
  page: number = 1,
  limit: number = 10,
  category?: string,
  tag?: string,
  query?: string
): Promise<PaginationResponse<BlogData>> {
  try {
    const response = await axios.get(`${API_URL}/blog`, {
      params: { page, limit, category, tag, query },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
}

// Fetch blog by slug (public route)
export async function getBlogBySlug(slug: string): Promise<BlogData> {
  try {
    const response = await axios.get(`${API_URL}/blog/${slug}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    throw error;
  }
}

// Fetch all blog categories (public route)
export async function getBlogCategories(): Promise<string[]> {
  try {
    const response = await axios.get(`${API_URL}/blog/categories`);
    return response.data.data.categories;
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    throw error;
  }
}

// Create a new blog (protected route)
export async function createBlog(
  blogData: BlogData,
  files: File[]
): Promise<BlogData> {
  try {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("content", blogData.content);
    formData.append("category", blogData.category || "");
    formData.append("type", blogData.type || "blog");
    formData.append("tags", JSON.stringify(blogData.tags || []));
    formData.append("status", blogData.status || "draft");
    files.forEach((file) => formData.append("files", file));

    const response = await axios.post(`${API_URL}/blog`, formData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
}

// Update an existing blog (protected route)
export async function updateBlog(
  id: string,
  blogData: BlogData,
  files: File[],
  removedFiles: string[] = []
): Promise<BlogData> {
  try {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("content", blogData.content);
    formData.append("category", blogData.category || "");
    formData.append("tags", JSON.stringify(blogData.tags || []));
    formData.append("status", blogData.status || "draft");
    formData.append("removedFiles", JSON.stringify(removedFiles));
    files.forEach((file) => formData.append("files", file));

    const response = await axios.put(`${API_URL}/blog/${id}`, formData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
}

// Delete a blog (protected route)
export async function deleteBlog(id: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/blog/${id}`);
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
}

// Update blog status (protected route)
export async function updateBlogStatus(
  id: string,
  status: "draft" | "published" | "archived"
): Promise<BlogData> {
  try {
    const response = await axios.put(`${API_URL}/blog/${id}/status`, {
      status,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error updating blog status:", error);
    throw error;
  }
}

// Remove a file from a blog (protected route)
export async function removeBlogFile(
  id: string,
  fileUrl: string
): Promise<BlogData> {
  try {
    const response = await axios.put(`${API_URL}/blog/${id}/files/remove`, {
      fileUrl,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error removing blog file:", error);
    throw error;
  }
}
