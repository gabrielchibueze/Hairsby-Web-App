"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/contexts/auth.context";
import {
  Calendar,
  CreditCard,
  Heart,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  User,
  UserCheck2Icon,
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
    title: "Appointments",
    href: "/dashboard/appointments",
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
    icon: CreditCard,
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
    title: "Appointments",
    href: "/dashboard/appointments",
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
    icon: CreditCard,
  },
  {
    title: "Specialist Dashboard",
    href: "/provider",
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

export function Sidebar() {
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
          {routes.map((route) => (
            <Button
              key={route.href}
              variant="ghost"
              className={cn(
                "w-full justify-start text-white hover:bg-hairsby-orange/40 hover:text-white transition-colors rounded-lg",
                pathname === route.href &&
                  "bg-hairsby-orange text-hairsby-dark hover:bg-hairsby-orange font-medium"
              )}
              asChild
            >
              <Link href={route.href} className="flex items-center">
                <route.icon className="mr-3 h-5 w-5" />
                <span>{route.title}</span>
              </Link>
            </Button>
          ))}
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
