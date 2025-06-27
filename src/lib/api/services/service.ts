import axios from "axios";
import { Booking } from "./booking";
import { Review } from "../accounts/reviews";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  discountPrice?: number;
  currency?: string;
  duration: number;
  category: string;
  images: string[];
  bookings?: Booking[];
  serviceReviews?: Review[];
  reviewCount?: number;
  provider: {
    id: string;
    businessName?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
    address?: string;
    city?: string;
    country?: string;
    rating?: number;
    totalReviews?: number;
  };
  averageRating?: number;
  isPackage?: boolean;
  isAvailable?: boolean;
  requiresAdvancePayment?: boolean;
  advancePaymentType?: "fixed" | "percentage";
  advancePaymentAmount?: number;
  cancellationPolicy?: "flexible" | "moderate" | "strict";
  packageServices?: string[];
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

export interface UpdateServicePayload {
  name?: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  duration?: number;
  category?: string;
  images?: File[];
  isPackage?: boolean;
  isAvailable?: boolean;
  packageServices?: string[];
  removedImages?: string[];
  requiresAdvancePayment?: boolean;
  advancePaymentAmount?: number;
  advancePaymentType?: "fixed" | "percentage";
  cancellationPolicy?: "flexible" | "moderate" | "strict";
}

export interface CreateServiceCategoryPayload {
  name: string;
  description?: string;
  icon?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

// export async function getServices({
//   query,
//   category,
//   type,
//   style,
//   minPrice,
//   maxPrice,
//   latitude,
//   longitude,
//   radius = 50,
//   page = 1,
//   limit = 10,
// }: {
//   query?: string;
//   category?: string;
//   type?: string;
//   style?: string;
//   minPrice?: number;
//   maxPrice?: number;
//   latitude?: number;
//   longitude?: number;
//   radius?: number;
//   page?: number;
//   limit?: number;
// } = {}) {
//   try {
//     const response = await axios.get(`${API_URL}/services`, {
//       params: {
//         query,
//         category,
//         type,
//         style,
//         minPrice,
//         maxPrice,
//         latitude,
//         longitude,
//         radius,
//         page,
//         limit,
//       },
//     });
//     return response.data.data;
//   } catch (error) {
//     console.error("Error fetching services:", error);
//     // Return dummy data if API fails
//     return {
//       services: [
//         {
//           id: "service-123",
//           name: "Sample Service",
//           description: "This is a sample service",
//           price: 100.0,
//           duration: 60,
//           category: "sample-category",
//           images: [],
//           provider: {
//             id: "1",
//             businessName: "Luxe Hair Studio",
//             rating: 4.8,
//             longitude: 125.85,
//             latitude: 809.25,
//             totalReviews: 156,
//             photo:
//               "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1974&auto=format&fit=crop",
//             address: "123 Service Lane, London",
//           },
//           isPackage: false,
//           isAvailable: true,
//         },
//       ],
//       pagination: {
//         total: 1,
//         page: 1,
//         totalPages: 1,
//       },
//     };
//   }
// }

export async function getServices({
  query,
  category,
  minPrice,
  maxPrice,
  minDuration,
  maxDuration,
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
  minDuration?: number;
  maxDuration?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedResponse<Service>> {
  try {
    const response = await axios.get(`${API_URL}/services`, {
      params: {
        query,
        category,
        minPrice,
        maxPrice,
        minDuration,
        maxDuration,
        latitude,
        longitude,
        radius,
        page,
        limit,
      },
    });

    return {
      data: response.data.data.services,
      pagination: response.data.data.pagination,
    };
  } catch (error) {
    console.error("Error fetching services:", error);
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        totalPages: 0,
      },
    };
  }
}
export async function getServiceById(id: string): Promise<Service> {
  try {
    const response = await axios.get(`${API_URL}/services/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
// Fetch featured services
export async function getFeaturedServices(): Promise<Service[]> {
  try {
    const response = await axios.get(`${API_URL}/services/featured`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching featured services:", error);
    // Return dummy data if API fails
    return [
      {
        id: "1",
        name: "Hair Styling",
        description: "Expert hair styling services for any occasion",
        price: 75.0,
        duration: 60,
        category: "Hair",
        images: [
          "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1974&auto=format&fit=crop",
        ],
        isAvailable: true,
        provider: {
          id: "1",
          businessName: "Luxe Hair Studio",
          rating: 4.8,
          photo:
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1974&auto=format&fit=crop",
        },
      },
      {
        id: "2",
        name: "Professional Makeup",
        description: "Professional makeup services for all events",
        price: 85.0,
        duration: 45,
        category: "Makeup",
        images: [
          "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=1974&auto=format&fit=crop",
        ],
        isAvailable: true,
        provider: {
          id: "2",
          businessName: "Glam Squad",
          rating: 4.9,
          photo:
            "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=1974&auto=format&fit=crop",
        },
      },
      {
        id: "3",
        name: "Nail Art & Care",
        description: "Complete nail care and design services",
        price: 45.0,
        duration: 60,
        category: "Nails",
        images: [
          "https://images.unsplash.com/photo-1610992015732-2449b0dd2b3f?q=80&w=1974&auto=format&fit=crop",
        ],
        isAvailable: true,
        provider: {
          id: "3",
          businessName: "Nail Paradise",
          rating: 4.7,
          photo:
            "https://images.unsplash.com/photo-1610992015737-75210412e10f?q=80&w=1974&auto=format&fit=crop",
        },
      },
      {
        id: "4",
        name: "Facial Treatment",
        description: "Advanced skincare treatments and facials",
        price: 95.0,
        duration: 75,
        category: "Skincare",
        images: [
          "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1974&auto=format&fit=crop",
        ],
        isAvailable: true,
        provider: {
          id: "4",
          businessName: "Glow Spa",
          rating: 4.9,
          photo:
            "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1974&auto=format&fit=crop",
        },
      },
    ];
  }
}

// export async function createService(payload: CreateServicePayload) {
//   try {
//     const formData = new FormData();
//     Object.entries(payload).forEach(([key, value]) => {
//       if (key === "images") {
//         // Handle file uploads for images
//         if (Array.isArray(value)) {
//           value.forEach((file, index) => {
//             formData.append(`${key}[${index}]`, file);
//           });
//         }
//       } else {
//         formData.append(key, value);
//       }
//     });

//     const response = await axios.post(`${API_URL}/services`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data.data;
//   } catch (error) {
//     console.error("Error creating service:", error);
//     throw error;
//   }
// }

export async function createService(
  payload: FormData,
  businessEmployeeData?: any
) {
  try {
    let response;
    if (businessEmployeeData?.employeeId && businessEmployeeData?.businessId) {
      response = await axios.post(
        `${API_URL}/services?businessId=${businessEmployeeData?.businessId}&employeeId=${businessEmployeeData?.employeeId}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else {
      response = await axios.post(`${API_URL}/services`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function updateService(
  id: string,
  payload: FormData,
  businessEmployeeData?: any
) {
  try {
    let response;
    if (businessEmployeeData.employeeId && businessEmployeeData.businessId) {
      response = await axios.put(
        `${API_URL}/services/${id}?businessId=${businessEmployeeData?.businessId}&employeeId=${businessEmployeeData?.employeeId}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else {
      response = await axios.put(`${API_URL}/services/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

// export async function updateService(id: string, payload: UpdateServicePayload) {
//   try {
//     const formData = new FormData();

//     // Append all non-file fields
//     Object.entries(payload).forEach(([key, value]) => {
//       if (key === "images") {
//         // Handle images array separately
//         if (Array.isArray(value)) {
//           value.forEach((file, index) => {
//             formData.append("images", file);
//           });
//         }
//       } else if (value !== undefined) {
//         formData.append(key, String(value));
//       }
//     });

//     const response = await axios.put(`${API_URL}/services/${id}`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data.data;
//   } catch (error) {
//     console.error("Error updating service:", error);
//     throw error;
//   }
// }
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
    return response.data.data.services;
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
          isAvailable: true,
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
    console.log(response.data.data.data);
    return response.data.data.data;
  } catch (error) {
    console.error("Error fetching service categories:", error);
    // Return dummy data if API fails
    return [
      // {
      //   id: "cat-123",
      //   name: "Sample Category",
      //   description: "This is a sample category",
      //   slug: "sample-category",
      //   status: "active",
      // },
    ];
  }
}

// Admin protected routes
export async function getServiceCategoryById(id: string) {
  try {
    const response = await axios.get(`${API_URL}/services/categories/${id}`);
    return response.data.data;
  } catch (error) {
    // Return dummy data if API fails
    return;
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
    throw error;
  }
}

export async function deleteServiceCategory(id: string) {
  try {
    const response = await axios.delete(`${API_URL}/services/categories/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
