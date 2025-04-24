"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/contexts/auth.context";
import {
  Calendar,
  CarTaxiFront,
  CreditCard,
  DollarSign,
  Heart,
  LayoutDashboard,
  LucideShoppingBag,
  Package,
  Settings,
  ShoppingBag,
  User,
  UserCheck2Icon,
  Wallet,
} from "lucide-react";
import { title } from "process";
import { HairsbyLogo } from "../logo";

const customerRoutes = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    href: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: LucideShoppingBag,
  },
  {
    title: "Favorites",
    href: "/dashboard/favorites",
    icon: Heart,
  },
  {
    title: "Wallet",
    href: "/dashboard/wallet",
    icon: CreditCard,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: Wallet,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const providerRoutes = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    href: "/dashboard/bookings",
    icon: Calendar,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Favorites",
    href: "/dashboard/favorites",
    icon: Heart,
  },
  {
    title: "Wallet",
    href: "/dashboard/wallet",
    icon: DollarSign,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: Wallet,
  },
  {
    title: "Specialist Dashboard",
    href: "/dashboard/#",
    icon: UserCheck2Icon,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const routes = user?.role === "customer" ? customerRoutes : providerRoutes;

  return (
    <div className="flex h-full flex-col bg-hairsby-dark text-white">
      <div className="p-6 border-b border-[#1e293b]">
        <Link href="/" className="flex items-center">
          <HairsbyLogo type="white" className="text-white h-8" />
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {routes.map((route) => {
            // Exact match OR starts with route href + "/" (for child routes)
            // But exclude matches where it's just a partial prefix
            const isActive =
              pathname === route.href ||
              (pathname.startsWith(`${route.href}/`) &&
                route.href !== "/dashboard");

            // Special case: /dashboard should only activate on exact match
            const isDashboardRoot =
              route.href === "/dashboard" && pathname === "/dashboard";

            return (
              <Button
                key={route.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white hover:bg-hairsby-orange/40 hover:text-white transition-colors rounded-lg",
                  (isActive || isDashboardRoot) &&
                    "bg-hairsby-orange text-hairsby-dark hover:bg-hairsby-orange font-medium"
                )}
                asChild
                onClick={onMenuClick}
              >
                <Link
                  href={route.href}
                  className="flex items-center gap-3 px-4 py-2"
                >
                  <route.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{route.title}</span>
                </Link>
              </Button>
            );
          })}{" "}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-[#1e293b]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hairsby-orange text-hairsby-dark font-bold">
            {user?.firstName[0]}
            {user?.lastName[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
