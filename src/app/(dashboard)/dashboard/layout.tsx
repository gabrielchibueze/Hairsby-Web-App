// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/lib/contexts/auth.context";
// import { Sidebar } from "@/components/layout/sidebar";
// import { DashboardNav } from "@/components/layout/dashboard-nav";
// import { Sheet, SheetContent } from "@/components/ui/sheet";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { user, isLoading } = useAuth();
//   const router = useRouter();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   useEffect(() => {
//     if (!isLoading && !user) {
//       router.push("/login");
//     }
//   }, [user, isLoading, router]);

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="flex min-h-screen">
//       {/* Desktop Sidebar */}
//       <div className="hidden lg:block relative">
//         <Sidebar />
//       </div>

//       {/* Mobile Sidebar */}
//       <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
//         <SheetContent side="left" className="w-64 p-0">
//           <Sidebar />
//         </SheetContent>
//       </Sheet>

//       <div className="flex-1">
//         <DashboardNav onMenuClick={() => setIsSidebarOpen(true)} />
//         <main className="container py-6">{children}</main>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth.context";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e17]">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-[#F9A000]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Fixed */}
      <div className="hidden lg:block fixed inset-y-0 z-50 w-64">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-hairsby-dark border-0"
          // overlayClassName="bg-black/80"
        >
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-40">
          <DashboardNav onMenuClick={() => setIsSidebarOpen(true)} />
        </div>

        {/* Content Container */}
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
