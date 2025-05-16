"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth.context";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminNav } from "@/components/admin/admin-nav";
import { ThemeProvider } from "next-themes";
// import { ThemeProvider } from "@/components/systemProviders/theme-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1">
          <AdminNav />
          <main className="container py-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
