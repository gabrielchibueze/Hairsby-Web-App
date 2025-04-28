"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserProfile } from "../api/accounts/profile";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  token: string;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setToken(token);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/account/profile`
        );
        setUser(response.data.data);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setToken("");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/account/profile/update`,
        data
      );
      setUser((prev) => ({ ...prev!, ...response.data.data }));
      return response.data.data;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      console.log(response);

      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      // Redirect based on user role
      switch (user.role) {
        case "customer":
          router.push("/dashboard");
          break;
        case "specialist":
        case "business":
          router.push("/provider/dashboard");
          break;
        case "admin":
          router.push("/admin/dashboard");
          break;
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (data: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        data
      );

      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      // Redirect based on user role
      switch (user.role) {
        case "customer":
          router.push("/dashboard");
          break;
        case "specialist":
        case "business":
          router.push("/provider/onboarding");
          break;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
