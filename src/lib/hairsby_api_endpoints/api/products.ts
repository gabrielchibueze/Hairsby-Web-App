import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  category: string;
  brand: string;
  images: string[];
  stock: number;
  provider: {
    id: string;
    businessName: string;
    rating: number;
  };
}

export async function searchProducts(params: {
  query?: string;
  category?: string;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}): Promise<Product[]> {
  try {
    const response = await axios.get(`${API_URL}/products/search`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Error searching products:", error);
    // Return dummy data if API fails
    return [
      {
        id: "1",
        name: "Professional Hair Care Shampoo",
        description: "Premium salon-quality shampoo for all hair types",
        price: 24.99,
        originalPrice: 29.99,
        discount: 17,
        rating: 4.8,
        reviews: 128,
        category: "hair",
        brand: "LuxeHair",
        images: [
          "https://images.unsplash.com/photo-1522337660859-02fbefca4702",
          "https://images.unsplash.com/photo-1522337094846-8a818d7aad80",
        ],
        stock: 50,
        provider: {
          id: "1",
          businessName: "Luxe Hair Studio",
          rating: 4.9,
        },
      },
      {
        id: "2",
        name: "Hydrating Face Cream",
        description: "Deep moisturizing cream for all skin types",
        price: 34.99,
        originalPrice: 34.99,
        discount: 0,
        rating: 4.7,
        reviews: 95,
        category: "skin",
        brand: "GlowSkin",
        images: [
          "https://images.unsplash.com/photo-1612817288484-6f916006741a",
          "https://images.unsplash.com/photo-1612817288351-eebed61cf5b9",
        ],
        stock: 35,
        provider: {
          id: "2",
          businessName: "Glow Beauty",
          rating: 4.8,
        },
      },
    ];
  }
}

export async function getProductById(id: string): Promise<Product> {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    // throw error;
    return {
      id: "1",
      name: "Professional Hair Care Shampoo",
      description: "Premium salon-quality shampoo for all hair types",
      price: 24.99,
      originalPrice: 29.99,
      discount: 17,
      rating: 4.8,
      reviews: 128,
      category: "hair",
      brand: "LuxeHair",
      images: [
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1974&auto=format&fit=crop",
      ],
      stock: 50,
      provider: {
        id: "1",
        businessName: "Luxe Hair Studio",
        rating: 4.9,
      },
    };
  }
}

export async function getProductCategories() {
  try {
    const response = await axios.get(`${API_URL}/products/categories`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product categories:", error);
    throw error;
  }
}
