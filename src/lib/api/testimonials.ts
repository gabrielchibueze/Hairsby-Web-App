import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  photo: string;
  comment: string;
  rating: number;
  service: string;
  provider: {
    id: string;
    businessName: string;
  };
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await axios.get(`${API_URL}/reviews/featured`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    // Return dummy data if API fails
    return [
      {
        id: "1",
        name: "Emma Thompson",
        role: "Fashion Blogger",
        photo:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
        comment:
          "Absolutely amazing service! My hair has never looked better. The specialist was professional and really understood what I wanted.",
        rating: 5,
        service: "Hair Styling",
        provider: {
          id: "1",
          businessName: "Luxe Hair Studio",
        },
      },
      {
        id: "2",
        name: "Sophie Chen",
        role: "Makeup Artist",
        photo:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1974&auto=format&fit=crop",
        comment:
          "The nail art service was exceptional. The attention to detail and creativity was beyond my expectations.",
        rating: 5,
        service: "Nail Art",
        provider: {
          id: "2",
          businessName: "Nail Paradise",
        },
      },
      {
        id: "3",
        name: "Maria Garcia",
        role: "Wedding Planner",
        photo:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1974&auto=format&fit=crop",
        comment:
          "Found my go-to makeup artist through Hairsby. The booking process was smooth and the results were stunning!",
        rating: 5,
        service: "Bridal Makeup",
        provider: {
          id: "3",
          businessName: "Glam Squad",
        },
      },
    ];
  }
}
