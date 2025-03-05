import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  category: string;
  tags: string[];
  coverImage: string;
  images: string[];
  author: {
    id: string;
    name: string;
    photo: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  status: "draft" | "published" | "archived";
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export async function getBlogPosts(params?: {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  posts: BlogPost[];
  total: number;
  totalPages: number;
}> {
  try {
    const response = await axios.get(`${API_URL}/blog`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    // Return dummy data if API fails
    return {
      posts: [
        {
          id: "1",
          title: "Top Hair Trends for 2025",
          content:
            "Discover the hottest hair trends that will dominate the beauty scene in 2025...",
          excerpt:
            "Discover the hottest hair trends that will dominate the beauty scene in 2025.",
          slug: "top-hair-trends-2025",
          category: "Hair",
          tags: ["trends", "hair", "style"],
          coverImage:
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702",
          images: [
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702",
            "https://images.unsplash.com/photo-1522337094846-8a818d7aad80",
          ],
          author: {
            id: "1",
            name: "Sarah Johnson",
            photo:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            role: "Beauty Expert",
          },
          publishedAt: "2025-02-25",
          readTime: "5 min read",
          status: "published",
        },
        {
          id: "1",
          title: "Top Hair Trends for 2025",
          content:
            "Discover the hottest hair trends that will dominate the beauty scene in 2025...",
          excerpt:
            "Discover the hottest hair trends that will dominate the beauty scene in 2025.",
          slug: "top-hair-trends-2025",
          category: "Hair",
          tags: ["trends", "hair", "style"],
          coverImage:
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702",
          images: [
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702",
            "https://images.unsplash.com/photo-1522337094846-8a818d7aad80",
          ],
          author: {
            id: "2",
            name: "Sarah Johnson",
            photo:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            role: "Beauty Expert",
          },
          publishedAt: "2025-02-25",
          readTime: "5 min read",
          status: "published",
        },
        {
          id: "3",
          title: "Top Hair Trends for 2025",
          content:
            "Discover the hottest hair trends that will dominate the beauty scene in 2025...",
          excerpt:
            "Discover the hottest hair trends that will dominate the beauty scene in 2025.",
          slug: "top-hair-trends-2025",
          category: "Hair",
          tags: ["trends", "hair", "style"],
          coverImage:
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702",
          images: [
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702",
            "https://images.unsplash.com/photo-1522337094846-8a818d7aad80",
          ],
          author: {
            id: "1",
            name: "Sarah Johnson",
            photo:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            role: "Beauty Expert",
          },
          publishedAt: "2025-02-25",
          readTime: "5 min read",
          status: "published",
        },
      ],
      total: 4,
      totalPages: 1,
    };
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  try {
    const response = await axios.get(`${API_URL}/blog/${slug}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return {
      id: "1",
      title: "Top Hair Trends for 2025",
      content:
        "Discover the hottest hair trends that will dominate the beauty scene in 2025...",
      excerpt:
        "Discover the hottest hair trends that will dominate the beauty scene in 2025.",
      slug: "top-hair-trends-2025",
      category: "Hair",
      tags: ["trends", "hair", "style"],
      coverImage:
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702",
      images: [
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702",
        "https://images.unsplash.com/photo-1522337094846-8a818d7aad80",
      ],
      author: {
        id: "1",
        name: "Sarah Johnson",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        role: "Beauty Expert",
      },
      publishedAt: "2025-02-25",
      readTime: "5 min read",
      status: "published",
    };
  }
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const response = await axios.get(`${API_URL}/blog/categories`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return [
      {
        id: "hair",
        name: "Hair",
        slug: "hair",
        description: "Tips and trends for hair care and styling",
      },
      {
        id: "makeup",
        name: "Makeup",
        slug: "makeup",
        description: "Makeup tutorials and beauty tips",
      },
      {
        id: "skincare",
        name: "Skincare",
        slug: "skincare",
        description: "Skincare routines and product recommendations",
      },
    ];
  }
}

// Create a new blog (requires authentication)
export async function createBlog(
  blogData: FormData,
  token: string
): Promise<BlogPost | null> {
  try {
    const response = await axios.post(`${API_URL}/blogs`, blogData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    return null;
  }
}

// Update a blog by ID (requires authentication)
export async function updateBlog(
  id: string,
  blogData: FormData,
  token: string
): Promise<BlogPost | null> {
  try {
    const response = await axios.put(`${API_URL}/blogs/${id}`, blogData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    return null;
  }
}

// Delete a blog by ID (requires authentication)
export async function deleteBlog(id: string, token: string): Promise<boolean> {
  try {
    await axios.delete(`${API_URL}/blogs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    console.error("Error deleting blog:", error);
    return false;
  }
}

// Update blog status
export async function updateBlogStatus(
  id: string,
  status: "draft" | "published" | "archived",
  token: string
): Promise<boolean> {
  try {
    await axios.put(
      `${API_URL}/blogs/${id}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch (error) {
    console.error("Error updating blog status:", error);
    return false;
  }
}

// Remove a file from a blog (Admin only)
export async function removeFile(
  id: string,
  fileUrl: string,
  token: string
): Promise<boolean> {
  try {
    await axios.put(
      `${API_URL}/blogs/${id}/files/remove`,
      { fileUrl },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch (error) {
    console.error("Error removing file from blog:", error);
    return false;
  }
}
