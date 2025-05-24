"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { UserProfile } from "../api/accounts/profile";
import path from "path";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    if (user?.id && token && pathname.startsWith("/login")) {
      if (redirect) {
        router.push(redirect);
        toast({
          title: "Redirecting...",
          description: "You are authenicated",
        });
      }
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setToken(token);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/account/profile`
        );
        setIsAuthenticated(true);
        setUser(response.data.data);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setToken("");
      setIsAuthenticated(false);
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

      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
      if (redirect) {
        router.push(redirect);
      } else {
        // Redirect based on user role
        switch (user.role) {
          case "customer":
            router.push("/dashboard");
            break;
          case "specialist":
          case "business":
            router.push("/provider");
            break;
          case "admin":
            router.push("/admin");
            break;
        }
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
      setIsAuthenticated(true);
      if (redirect) {
        router.push(redirect);
      } else {
        // Redirect based on user role
        switch (user.role) {
          case "customer":
            router.push("/dashboard");
            break;
          case "specialist":
          case "business":
            router.push("/provider");
            break;
          case "admin":
            router.push("/admin");
            break;
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
    setTimeout(() => {
      router.refresh();
    }, 3000);
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/provider") ||
      pathname.startsWith("/admin")
    ) {
      router.push("/");
      setTimeout(() => {
        router.refresh();
      }, 3000);
    } else {
      return;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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
