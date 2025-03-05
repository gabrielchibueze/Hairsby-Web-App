import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  images: string[];
  isAvailable: boolean;
  provider: {
    id: string;
    businessName: string;
    rating: number;
    totalReviews: number;
    photo: string;
    address: string;
  };
  reviews: Array<{
    id: string;
    customer: {
      name: string;
      photo: string;
    };
    rating: number;
    comment: string;
    date: string;
  }>;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface SearchServicesParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  location?: {
    latitude: number;
    longitude: number;
    radius?: number;
  };
  page?: number;
  limit?: number;
}

export async function searchServices(params: SearchServicesParams): Promise<{
  services: Service[];
  total: number;
  totalPages: number;
}> {
  try {
    const response = await axios.get(`${API_URL}/services/search`, { params });
    return response.data.data;
  } catch (error) {
    console.error("Error searching services:", error);
    // Return dummy data if API fails
    return {
      services: [
        {
          id: "1",
          name: "Hair Styling",
          description: "Expert hair styling services for any occasion",
          price: 75.0,
          duration: 60,
          category: "Hair",
          images: [
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1974&auto=format&fit=crop",
          ],
          isAvailable: true,
          provider: {
            id: "1",
            businessName: "Luxe Hair Studio",
            rating: 4.8,
            totalReviews: 156,
            photo:
              "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1974&auto=format&fit=crop",
            address: "123 Beauty Lane, London",
          },
          reviews: [
            {
              id: "1",
              customer: {
                name: "Emma Thompson",
                photo:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
              },
              rating: 5,
              comment: "Amazing service! Very professional and friendly.",
              date: "2025-02-25",
            },
          ],
        },
      ],
      total: 1,
      totalPages: 1,
    };
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

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  try {
    const response = await axios.get(`${API_URL}/services/categories`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching service categories:", error);
    return [
      {
        id: "hair",
        name: "Hair",
        description: "Professional hair styling services",
        icon: "✂️",
      },
      {
        id: "makeup",
        name: "Makeup",
        description: "Professional makeup services",
        icon: "💄",
      },
      {
        id: "nails",
        name: "Nails",
        description: "Nail care and design services",
        icon: "💅",
      },
      {
        id: "skincare",
        name: "Skincare",
        description: "Facial and skincare treatments",
        icon: "✨",
      },
    ];
  }
}

export async function getServiceById(id: string): Promise<Service> {
  try {
    const response = await axios.get(`${API_URL}/services/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching service:", error);
    // throw error
    return {
      id: "1",
      name: "Hair Styling",
      description: "Expert hair styling services for any occasion",
      price: 75.0,
      duration: 60,
      category: "Hair",
      images: [
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1974&auto=format&fit=crop",
      ],
      isAvailable: true,
      provider: {
        id: "1",
        businessName: "Luxe Hair Studio",
        rating: 4.8,
        totalReviews: 156,
        photo:
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1974&auto=format&fit=crop",
        address: "123 Beauty Lane, London",
      },
      reviews: [
        {
          id: "1",
          customer: {
            name: "Emma Thompson",
            photo:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
          },
          rating: 5,
          comment: "Amazing service! Very professional and friendly.",
          date: "2025-02-25",
        },
      ],
    };
  }
}
