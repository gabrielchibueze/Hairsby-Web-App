"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { UserProfile } from "../api/accounts/profile";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_REDIRECTS: Record<string, string> = {
  customer: "/dashboard",
  specialist: "/provider",
  business: "/provider",
  admin: "/admin",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    user: UserProfile | null;
    token: string;
    isLoading: boolean;
  }>({
    user: null,
    token: "",
    isLoading: true,
  });

  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const isAuthenticated = useMemo(() => !!state.user, [state.user]);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();

      if (state.user?.id && state.token && pathname.startsWith("/login")) {
        handlePostAuthRedirect();
      }
    };

    initializeAuth();
  }, [state.token, pathname]);

  const getRedirectUrl = () => {
    if (typeof window === "undefined") return null;
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("redirect");
  };

  const handlePostAuthRedirect = () => {
    const redirect = getRedirectUrl();
    if (redirect) {
      router.push(redirect);
      toast({
        title: "Redirecting...",
        description: "You are authenticated",
      });
    } else if (state.user?.role) {
      router.push(ROLE_REDIRECTS[state.user.role] || "/");
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/account/profile`
      );

      setState((prev) => ({
        ...prev,
        user: response.data.data,
        token,
        isLoading: false,
      }));
    } catch (error) {
      clearAuthState();
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const clearAuthState = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setState({
      user: null,
      token: "",
      isLoading: false,
    });
  };

  const updateProfile = async (
    data: Partial<UserProfile>
  ): Promise<UserProfile> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/account/profile/update`,
        data
      );

      setState((prev) => ({
        ...prev,
        user: { ...prev.user!, ...response.data.data },
      }));

      return response.data.data;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleAuthSuccess = (token: string, user: UserProfile) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setState({
      user,
      token,
      isLoading: false,
    });

    // handlePostAuthRedirect();
  };

  const login = async (email: string, password: string) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      { email, password }
    );
    handleAuthSuccess(response.data.data.token, response.data.data.user);
  };

  const signup = async (data: any) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
      data
    );
    handleAuthSuccess(response.data.data.token, response.data.data.user);
  };

  const logout = async () => {
    try {
      // Optional: Call logout API if you have one
      // await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
    } finally {
      clearAuthState();
      const isProtectedRoute = ["/dashboard", "/provider", "/admin"].some(
        (path) => pathname.startsWith(path)
      );

      window.location.href = isProtectedRoute ? "/" : window.location.pathname;
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    }
  };

  const contextValue = useMemo(
    () => ({
      user: state.user,
      isAuthenticated,
      token: state.token,
      isLoading: state.isLoading,
      login,
      signup,
      logout,
      updateProfile,
    }),
    [state, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
