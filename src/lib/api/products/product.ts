import axios from "axios";
import { Order } from "./order";
import { Review } from "../accounts/reviews";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  notes?: string;
  category: string;
  brand: string;
  stock: number;
  images: string[];
  coverPhoto?: string;
  averageRating?: number;
  reviewCount: number;
  ordersCount?: number;
  orders?: Order[];
  quantity?: number;
  provider?: {
    id?: string;
    businessName?: string;
    firstName?: string;
    lastName?: string;
    photo?: string;
    address?: string;
    city?: string;
    country?: string;
    rating?: number;
  };
  variants?: Array<{
    id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
  }>;
  hasVariants: boolean;
  status: "active" | "inactive" | "out_of_stock";
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  icon?: string;
  status: "active" | "inactive";
  createdBy: string;
  metadata?: any;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  stock: number;
  images?: File[];
  isAvailable?: boolean;
  variants?: Array<{
    name: string;
    price: number;
    stock: number;
    images?: File[];
  }>;
}

export interface UpdateProductPayload extends CreateProductPayload {
  removedImages?: string[];
}

export interface AddVariantPayload {
  name: string;
  price: number;
  stock: number;
  images?: File[];
}

export interface UpdateVariantPayload extends AddVariantPayload {
  removedImages?: string[];
}

export interface CreateProductCategoryPayload {
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
}

export async function getProducts({
  query,
  category,
  brand,
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
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedResponse<Product>> {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: {
        query,
        category,
        brand,
        minPrice,
        maxPrice,
        latitude,
        longitude,
        radius,
        page,
        limit,
      },
    });

    return {
      data: response.data.data.products,
      pagination: response.data.data.pagination,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty paginated response instead of just empty array
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

export async function getProductById(id: string) {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

// export async function createProduct(
//   businessEmployeeData: any,
//   formData: FormData
// ) {
//   try {
//     const response = await axios.post(
//       `${API_URL}/products?businessId=${businessEmployeeData?.businessId}&employeeId=${businessEmployeeData.employeeId}`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     return response.data.data;
//   } catch (error) {
//     throw error;
//   }
// }

// export async function updateProduct(
//   id: string,
//   businessEmployeeData: any,
//   formData: FormData
// ) {
//   try {
//     const response = await axios.put(
//       `${API_URL}/products/${id}?businessId=${businessEmployeeData?.businessId}&employeeId=${businessEmployeeData?.employeeId}`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error updating product:", error);
//     throw error;
//   }
// }

export async function createProduct(
  payload: FormData,
  businessEmployeeData?: any
) {
  try {
    let response;
    if (businessEmployeeData?.employeeId && businessEmployeeData?.businessId) {
      response = await axios.post(
        `${API_URL}/products?businessId=${businessEmployeeData?.businessId}&employeeId=${businessEmployeeData?.employeeId}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else {
      response = await axios.post(`${API_URL}/products`, payload, {
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

export async function updateProduct(
  id: string,
  payload: FormData,
  businessEmployeeData?: any
) {
  try {
    let response;
    if (businessEmployeeData.employeeId && businessEmployeeData.businessId) {
      response = await axios.put(
        `${API_URL}/products/${id}?businessId=${businessEmployeeData?.businessId}&employeeId=${businessEmployeeData?.employeeId}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else {
      response = await axios.put(`${API_URL}/products/${id}`, payload, {
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
export async function deleteProduct(id: string) {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export async function updateStock(
  id: string,
  stock: number,
  variantId?: string
) {
  try {
    const response = await axios.put(`${API_URL}/products/${id}/stock`, {
      stock,
      variantId,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
}

export async function addVariant(id: string, payload: AddVariantPayload) {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "images") {
        // Handle file uploads for variant images
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
      `${API_URL}/products/${id}/variants`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error adding variant:", error);
    throw error;
  }
}

export async function updateVariant(
  id: string,
  variantId: string,
  payload: UpdateVariantPayload
) {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "images") {
        // Handle file uploads for variant images
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
      `${API_URL}/products/${id}/variants/${variantId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating variant:", error);
    throw error;
  }
}

export async function deleteVariant(id: string, variantId: string) {
  try {
    const response = await axios.delete(
      `${API_URL}/products/${id}/variants/${variantId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error deleting variant:", error);
    throw error;
  }
}

export async function getAllProductCategories() {
  try {
    const response = await axios.get(`${API_URL}/products/categories`);
    return response.data.data.data;
  } catch (error) {
    console.error("Error fetching product categories:", error);
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

export async function getProductCategoryById(id: string) {
  try {
    const response = await axios.get(`${API_URL}/products/categories/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product category:", error);
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

export async function createProductCategory(
  payload: CreateProductCategoryPayload
) {
  try {
    const response = await axios.post(
      `${API_URL}/products/categories`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error creating product category:", error);
    throw error;
  }
}

export async function updateProductCategory(
  id: string,
  payload: CreateProductCategoryPayload
) {
  try {
    const response = await axios.put(
      `${API_URL}/products/categories/${id}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating product category:", error);
    throw error;
  }
}

export async function deleteProductCategory(id: string) {
  try {
    const response = await axios.delete(`${API_URL}/products/categories/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting product category:", error);
    throw error;
  }
}

export interface Brand {
  name: string;
  slug: string;
  productCount: number;
}

export interface PaginatedBrandsResponse {
  brands: Brand[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export async function getProductBrands({
  search,
  page = 1,
  limit = 10,
}: {
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedBrandsResponse> {
  try {
    const response = await axios.get(`${API_URL}/products/brands`, {
      params: { search, page, limit },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product brands:", error);
    return {
      brands: [],
      pagination: {
        total: 0,
        page: 1,
        totalPages: 0,
      },
    };
  }
}
