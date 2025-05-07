import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface Review {
  id: string;
  customer: {
    id?: string;
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
  createdAt?: string;
  metadata?: any;
}

export interface AddReviewPayload {
  rating: number;
  comment?: string;
  images?: string[];
}

export interface ReplyToReviewPayload {
  reply: string;
}
export interface BasicReviewPayload{
    id: string
    type: "service" | "product" | "provider"
}
export async function getReviews(payload: BasicReviewPayload) {
    try {
      const response = await axios.get(`${API_URL}/${payload.type}${payload.type !== "provider" ? "s":""}/reviews/${payload.id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      // Return dummy data if API fails
      return [];
    }
  }
  
  export async function addReview(basicData: BasicReviewPayload, payload: AddReviewPayload) {
    try {
      const response = await axios.post(
        `${API_URL}/${basicData.type}${basicData.type !== "provider" ? "s":""}/reviews/${basicData.id}`,
        payload
      );
      return response.data.data;
    } catch (error) {
      console.error("Error adding product review:", error);
      throw error;
    }
  }
  
  export async function replyToReview(basicData: BasicReviewPayload, payload: ReplyToReviewPayload) {
    try {
      const response = await axios.post(
        `${API_URL}/${basicData.type}${basicData.type !== "provider" ? "s":""}/reviews/${basicData.id}/reply`,
        payload
      );
      return response.data.data;
    } catch (error) {
      console.error("Error replying to review:", error);
      throw error;
    }
  }
  