import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  duration: number;
  category: string;
  images: string[];
  provider: {
    id: string;
    businessName?: string;
    rating?: number;
    totalReviews?: number;
    longitude?: number;
    latitude?: number;
    photo?: string;
    city?: string;
    address?: string;
  };
  isPackage: boolean;
  packageServices?: string[];
  status: "active" | "inactive";
  metadata?: any;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  icon?: string;
  status: "active" | "inactive";
  createdBy: string;
  metadata?: any;
}

export interface CreateServicePayload {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  duration: number;
  category: string;
  images?: File[];
  isPackage?: boolean;
  packageServices?: string[];
}

export interface UpdateServicePayload extends CreateServicePayload {
  removedImages?: string[];
}

export interface CreateServiceCategoryPayload {
  name: string;
  description?: string;
  icon?: string;
}

export async function getServices({
  query,
  category,
  type,
  style,
  minPrice,
  maxPrice,
  latitude,
  longitude,
  radius = 50,
  page = 1,
  limit = 10,
}: {
  query?: string;
  category?: string;
  type?: string;
  style?: string;
  minPrice?: number;
  maxPrice?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
} = {}) {
  try {
    const response = await axios.get(`${API_URL}/services`, {
      params: {
        query,
        category,
        type,
        style,
        minPrice,
        maxPrice,
        latitude,
        longitude,
        radius,
        page,
        limit,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    // Return dummy data if API fails
    return {
      services: [
        {
          id: "service-123",
          name: "Sample Service",
          description: "This is a sample service",
          price: 100.0,
          duration: 60,
          category: "sample-category",
          images: ["https://example.com/image.jpg"],
          provider: {
            id: "1",
            businessName: "Luxe Hair Studio",
            rating: 4.8,
            longitude: 125.85,
            latitude: 809.25,
            totalReviews: 156,
            photo:
              "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1974&auto=format&fit=crop",
            address: "123 Beauty Lane, London",
          },
          isPackage: false,
          status: "active",
        },
      ],
      pagination: {
        total: 1,
        page: 1,
        totalPages: 1,
      },
    };
  }
}

export async function getServiceById(id: string) {
  try {
    const response = await axios.get(`${API_URL}/services/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching service:", error);
    // Return dummy data if API fails
    return {
      id: "service-123",
      name: "Sample Service",
      description: "This is a sample service",
      price: 100.0,
      duration: 60,
      category: "sample-category",
      images: ["https://example.com/image.jpg"],
      providerId: "provider-123",
      isPackage: false,
      status: "active",
    };
  }
}

export async function createService(payload: CreateServicePayload) {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "images") {
        // Handle file uploads for images
        if (Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`${key}[${index}]`, file);
          });
        }
      } else {
        formData.append(key, value);
      }
    });

    const response = await axios.post(`${API_URL}/services`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

export async function updateService(id: string, payload: UpdateServicePayload) {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "images") {
        // Handle file uploads for images
        if (Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`${key}[${index}]`, file);
          });
        }
      } else {
        formData.append(key, value);
      }
    });

    const response = await axios.put(`${API_URL}/services/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

export async function deleteService(id: string) {
  try {
    const response = await axios.delete(`${API_URL}/services/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
}

export async function getPackages({
  query,
  category,
  minPrice,
  maxPrice,
  latitude,
  longitude,
  radius = 50,
  page = 1,
  limit = 10,
}: {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
} = {}) {
  try {
    const response = await axios.get(`${API_URL}/services/packages`, {
      params: {
        query,
        category,
        minPrice,
        maxPrice,
        latitude,
        longitude,
        radius,
        page,
        limit,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching packages:", error);
    // Return dummy data if API fails
    return {
      packages: [
        {
          id: "package-123",
          name: "Sample Package",
          description: "This is a sample package",
          price: 200.0,
          duration: 120,
          category: "sample-category",
          images: ["https://example.com/image.jpg"],
          providerId: "provider-123",
          isPackage: true,
          status: "active",
        },
      ],
      pagination: {
        total: 1,
        page: 1,
        totalPages: 1,
      },
    };
  }
}

export async function createPackage(payload: CreateServicePayload) {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "images") {
        // Handle file uploads for images
        if (Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`${key}[${index}]`, file);
          });
        }
      } else {
        formData.append(key, value);
      }
    });

    const response = await axios.post(
      `${API_URL}/services/packages`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating package:", error);
    throw error;
  }
}

export async function updatePackage(id: string, payload: UpdateServicePayload) {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "images") {
        // Handle file uploads for images
        if (Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`${key}[${index}]`, file);
          });
        }
      } else {
        formData.append(key, value);
      }
    });

    const response = await axios.put(
      `${API_URL}/services/packages/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating package:", error);
    throw error;
  }
}

export async function deletePackage(id: string) {
  try {
    const response = await axios.delete(`${API_URL}/services/packages/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting package:", error);
    throw error;
  }
}

export async function getServiceCategories() {
  try {
    const response = await axios.get(`${API_URL}/services/categories`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching service categories:", error);
    // Return dummy data if API fails
    return [
      {
        id: "cat-123",
        name: "Sample Category",
        description: "This is a sample category",
        slug: "sample-category",
        status: "active",
      },
    ];
  }
}

// Admin protected routes
export async function getServiceCategoryById(id: string) {
  try {
    const response = await axios.get(`${API_URL}/services/categories/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching service category:", error);
    // Return dummy data if API fails
    return {
      id: "cat-123",
      name: "Sample Category",
      description: "This is a sample category",
      slug: "sample-category",
      status: "active",
    };
  }
}

export async function createServiceCategory(
  payload: CreateServiceCategoryPayload
) {
  try {
    const response = await axios.post(
      `${API_URL}/services/categories`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating service category:", error);
    throw error;
  }
}

export async function updateServiceCategory(
  id: string,
  payload: CreateServiceCategoryPayload
) {
  try {
    const response = await axios.put(
      `${API_URL}/services/categories/${id}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating service category:", error);
    throw error;
  }
}

export async function deleteServiceCategory(id: string) {
  try {
    const response = await axios.delete(`${API_URL}/services/categories/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting service category:", error);
    throw error;
  }
}
