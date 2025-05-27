"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/contexts/auth.context";
import {
  Bell,
  Calendar,
  CarTaxiFront,
  CreditCard,
  DollarSign,
  Heart,
  LayoutDashboard,
  LucideShoppingBag,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  User,
  UserCheck2Icon,
  Wallet,
} from "lucide-react";
import { title } from "process";
import { HairsbyLogo } from "../general/logo";
import Image from "next/image";
import ProfilePhoto from "../general/profile-photo";
import { useTheme } from "next-themes";
// import { useTheme } from "../systemProviders/theme-provider";

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
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  { title: "Chat", href: null, icon: MessageSquare },
  { title: "Notifications", href: null, icon: Bell },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  // const { theme } = useTheme();
  const { theme } = useTheme();

  const routes = user?.role === "customer" ? customerRoutes : providerRoutes;
  const setCSToLocalStorage = (cs?: string) => {
    if (cs) {
      localStorage.setItem("cs", cs);
      // Force a state update by setting a timestamp
      localStorage.setItem("lastUpdated", Date.now().toString());
    }
  };
  return (
    <div className="flex h-full flex-col bg-muted text-sidebar-foreground">
      <div className="p-5">
        <HairsbyLogo
          type={`${theme === "light" ? "" : "white"}`}
          className="text-foreground h-8"
        />
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {routes.map((route) => {
            const isActive =
              pathname === route.href ||
              (pathname.startsWith(`${route.href}/`) &&
                route.href !== "/dashboard");

            const isDashboardRoot =
              route.href === "/dashboard" && pathname === "/dashboard";

            return (
              <Button
                key={route.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-foreground hover:bg-hairsby-orange/40 hover:text-foreground transition-colors rounded-lg",
                  (isActive || isDashboardRoot) &&
                    "bg-hairsby-orange text-hairsby-dark hover:text-hairsby-dark hover:bg-hairsby-orange font-medium"
                )}
                asChild
                onClick={onMenuClick}
              >
                {!route.href ? (
                  <div
                    className="flex items-center gap-3 py-2 cursor-pointer"
                    onClick={() =>
                      setCSToLocalStorage(route.title.toLocaleLowerCase())
                    }
                  >
                    <route.icon className="h-5 w-5 flex-shrink-0" />

                    <span className="whitespace-nowrap">{route.title}</span>
                  </div>
                ) : (
                  <Link
                    href={route.href}
                    className="flex items-center gap-3 py-2"
                  >
                    <route.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="whitespace-nowrap">{route.title}</span>
                  </Link>
                )}
              </Button>
            );
          })}{" "}
        </div>
      </ScrollArea>
      <div className="space-y-2 p-2">
        {/* User Profile Card */}
        <div className="flex items-center gap-3 group">
          {user && <ProfilePhoto user={user} />}
          <div className="overflow-hidden flex-1">
            <div className="flex items-center justify-between">
              <Link href="/dashboard/profile">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.firstName} {user?.lastName}
                </p>
              </Link>
              <Link href="/dashboard/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground/60 hover:text-foreground hover:bg-transparent"
                >
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
            {/* <p className="text-xs text-muted-foreground/60 truncate">{user?.email}</p> */}
            <div className="flex items-center justify-between px-0 py-0 rounded-lg text-xs text-muted-foreground ">
              <div className="flex items-center gap-1">
                <div className="h-1 w-1 rounded-full bg-hairsby-orange animate-pulse" />
                <span className="text-xs font-medium">Customer Account</span>
              </div>
              {user?.role && user?.role !== "customer" && (
                <Link href="/provider">
                  <Button
                    variant="ghost"
                    size="sm"
                    title={`Switch to your ${user.role} account`}
                    className="text-xs text-hairsby-orange hover:text-hairsby-orange/70 hover:bg-hairsby-orange/20 h-0 px-0"
                  >
                    Switch
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
