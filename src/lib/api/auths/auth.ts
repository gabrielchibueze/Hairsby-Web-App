import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3500/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: "customer" | "specialist" | "business" | "admin";
}

export interface ResetPasswordData {
  email: string;
  newPassword: string;
  token: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface ResendVerificationData {
  email: string;
}

export async function login(credentials: LoginCredentials) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function signup(data: SignupData) {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, data);
    // Store token in localStorage or secure cookie
    localStorage.setItem("token", response.data.data.token);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export async function logout() {
  localStorage.removeItem("token");
}

export async function resetPassword(email: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
}

export async function verifyResetToken(email: string, token: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-reset-token`, {
      email,
      token,
    });
    return response.data;
  } catch (error) {
    console.error("Verify reset token error:", error);
    throw error;
  }
}

export async function verifyEmail(token: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-email`, {
      token,
    });
    return response.data;
  } catch (error) {
    console.error("Verify email error:", error);
    throw error;
  }
}

export async function resendEmailVerification(email: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/resend-verification`, {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Resend email verification error:", error);
    throw error;
  }
}

export async function changePassword(data: ResetPasswordData) {
  try {
    const response = await axios.post(`${API_URL}/auth/change-password`, data);
    return response.data;
  } catch (error) {
    console.error("Change password error:", error);
    throw error;
  }
}
