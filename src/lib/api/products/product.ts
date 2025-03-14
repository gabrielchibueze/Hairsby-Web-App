import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  stock: number;
  images: string[];
  provider?: {
    id: string;
    businessName: string;
    firstName: string;
    lastName: string;
    photo: string;
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

export interface Review {
  id: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    photo?: string;
  };
  service?: {
    id: string;
    name: string;
    description: string;
    price: string;
    images: any;
  };
  product?: {
    id: string;
    name: string;
    description: string;
    price: string;
    images: any;
  };
  provider: {
    id: string;
    businessName: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
  rating: number;
  comment?: string;
  images?: string[];
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

export interface AddReviewPayload {
  rating: number;
  comment?: string;
  images?: string[];
}

export interface ReplyToReviewPayload {
  reply: string;
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
} = {}) {
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
    return response.data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return dummy data if API fails
    return {
      products: [
        {
          id: "prod-123",
          name: "Sample Product",
          description: "This is a sample product",
          price: 100.0,
          category: "sample-category",
          brand: "sample-brand",
          stock: 10,
          images: ["https://example.com/image.jpg"],
          providerId: "provider-123",
          hasVariants: false,
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

export async function getProductById(id: string) {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    // Return dummy data if API fails
    return {
      id: "prod-123",
      name: "Sample Product",
      description: "This is a sample product",
      price: 100.0,
      category: "sample-category",
      brand: "sample-brand",
      stock: 10,
      images: ["https://example.com/image.jpg"],
      providerId: "provider-123",
      hasVariants: false,
      status: "active",
    };
  }
}

export async function createProduct(payload: CreateProductPayload) {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "images" || key === "variants") {
        // Handle file uploads for images and variants
        if (Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`${key}[${index}]`, file);
          });
        }
      } else {
        formData.append(key, value);
      }
    });

    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

import axios from "axios";

export async function updateProduct(
  id: string,
  removedFiles: Array<string>,
  payload: UpdateProductPayload
) {
  try {
    const formData = new FormData();

    // Properly handle removed files array
    removedFiles.forEach((file, index) => {
      formData.append(`removedFiles[${index}]`, file);
    });

    Object.entries(payload).forEach(([key, value]) => {
      if (key === "images" || key === "variants") {
        // Handle file uploads for images and variants
        if (Array.isArray(value)) {
          value.forEach((file, index) => {
            formData.append(`${key}[${index}]`, file);
          });
        }
      } else {
        // Convert non-string values to strings
        formData.append(
          key,
          typeof value === "string" ? value : JSON.stringify(value)
        );
      }
    });

    const response = await axios.put(`${API_URL}/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error updating product:",
      error.response?.data || error.message
    );
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
    return response.data.data;
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

export async function getProductReviews(id: string) {
  try {
    const response = await axios.get(`${API_URL}/products/reviews/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    // Return dummy data if API fails
    return [
      {
        id: "review-123",
        productId: "prod-123",
        customerId: "cust-123",
        providerId: "prov-123",
        rating: 5,
        comment: "Great product!",
        images: ["https://example.com/image.jpg"],
      },
    ];
  }
}

export async function addProductReview(id: string, payload: AddReviewPayload) {
  try {
    const response = await axios.post(
      `${API_URL}/products/reviews/${id}`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error adding product review:", error);
    throw error;
  }
}

export async function replyToReview(id: string, payload: ReplyToReviewPayload) {
  try {
    const response = await axios.post(
      `${API_URL}/products/reviews/${id}/reply`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error("Error replying to review:", error);
    throw error;
  }
}
