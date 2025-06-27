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
  DollarSign,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import { HairsbyLogo } from "../general/logo";
import ProfilePhoto from "../general/profile-photo";
import { useTheme } from "next-themes";

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
    icon: ShoppingBag,
  },
  {
    title: "Favorites",
    href: "/dashboard/favorites",
    icon: Heart,
  },
  {
    title: "Cart",
    href: "/dashboard/cart",
    icon: ShoppingCart,
  },
  {
    title: "Wallet",
    href: "/dashboard/wallet",
    icon: DollarSign,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  { title: "Chat & Support", href: null, icon: MessageSquare },
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
  const { theme } = useTheme();

  const setCSToLocalStorage = (cs?: string) => {
    if (cs) {
      localStorage.setItem("cs", cs === "chat & support" ? "chat" : cs);
      localStorage.setItem("lastUpdated", Date.now().toString());
      onMenuClick?.();
    }
  };

  return (
    <div className="flex h-full flex-col bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <HairsbyLogo
          type={`${theme === "light" ? "" : "white"}`}
          className="h-4"
        />
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-1">
          {customerRoutes.map((route) => {
            const isActive =
              pathname === route.href ||
              (pathname.startsWith(`${route.href}/`) &&
                route.href !== "/dashboard");
            const isDashboardRoot =
              route.href === "/dashboard" && pathname === "/dashboard";

            return (
              <>
                {!route.href ? (
                  <div
                    key={route.href || route.title}
                    className={cn(
                      " cursor-pointer hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
                      "text-sidebar-foreground hover:bg-sidebar-accent",
                      // isActive || isDashboardRoot
                      //   ? "bg-hairsby-orange text-gray-50 font-medium hover:bg-hairsby-orange"
                      //   : "text-sidebar-muted hover:text-sidebar-foreground"
                      (isActive || isDashboardRoot) &&
                        "bg-hairsby-orange/10 hover:bg-hairsby-orange/10 text-hairsby-orange font-medium"

                      // isActive || isDashboardRoot
                      //   ? "bg-sidebar-accent/80 font-medium text-hairsby-orange"
                      //   : "text-sidebar-muted hover:text-sidebar-foreground"
                    )}
                    onClick={() => {
                      onMenuClick?.(),
                        setCSToLocalStorage(route.title.toLocaleLowerCase());
                    }}
                  >
                    <route.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{route.title}</span>
                  </div>
                ) : (
                  <Link
                    key={route.href || route.title}
                    href={route.href || "#"}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
                      "text-sidebar-foreground hover:bg-sidebar-accent",
                      (isActive || isDashboardRoot) &&
                        "bg-hairsby-orange/10 hover:bg-hairsby-orange/10 text-hairsby-orange font-medium"
                      // isActive || isDashboardRoot
                      //   ? "bg-hairsby-orange text-gray-50 font-medium hover:bg-hairsby-orange hover:text-gray-50 "
                      //   : "text-sidebar-muted hover:text-sidebar-foreground"
                    )}
                    onClick={onMenuClick}
                  >
                    <route.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{route.title}</span>
                  </Link>
                )}
              </>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 py-2 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          {user && <ProfilePhoto user={user} />}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <Link href="/dashboard/profile">
                <p className="text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
              </Link>
              <Link href="/dashboard/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-sidebar-muted hover:text-sidebar-foreground"
                >
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between -mt-1">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-hairsby-orange" />
                <span className="text-xs text-sidebar-muted capitalize">
                  customer account
                </span>
              </div>
              {user?.role && user?.role !== "customer" && (
                <Link href="/provider">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2 text-hairsby-orange hover:bg-hairsby-orange/10"
                    title={`Switch to your ${user.role} account`}
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
