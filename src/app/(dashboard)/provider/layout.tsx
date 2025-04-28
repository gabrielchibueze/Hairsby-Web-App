"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth.context";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { HairsbyIcon } from "@/components/logo";
import { ProviderSidebar } from "@/components/provider/provider-sidebar";
import { ProviderNav } from "@/components/provider/provider-nav";

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  console.log(isCollapsed);
  useEffect(() => {
    if (
      !isLoading &&
      (!user || !["specialist", "business"].includes(user.role))
    ) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-[#0a0e17]">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-hairsby-orange"></div>
        <div className="absolute">
          <HairsbyIcon />
        </div>
      </div>
    );
  }

  if (!user || !["specialist", "business"].includes(user.role)) {
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Fixed */}
      <div
        className={`hidden lg:block fixed inset-y-0 z-50 w-${isCollapsed ? "80" : "64"}`}
      >
        <ProviderSidebar
          isCollapsed={isCollapsed}
          toggleSidebar={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-hairsby-dark border-0"
          // overlayClassName="bg-black/80"
        >
          <ProviderSidebar onMenuClick={() => setIsSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className={`lg:pl-${isCollapsed ? "80" : "64"}`}>
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-40">
          <ProviderNav
            onMenuClick={() => setIsSidebarOpen(true)}
            isCollapsed={isCollapsed}
          />
        </div>
        {/* Content Container */}
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6">
          <div className={`mx-auto  max-w-7xl`}>
            <div
              className={`${isCollapsed ? "lg:ml-24" : ""} rounded-xl bg-white p-4 sm:p-6 shadow-sm`}
            >
              {children}
            </div>
          </div>
        </main>
        <div className="py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Hairsby. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
