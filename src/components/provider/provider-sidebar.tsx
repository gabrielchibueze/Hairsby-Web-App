"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/contexts/auth.context";
import {
  LayoutDashboard,
  Calendar,
  ShoppingBagIcon,
  ScissorsSquareIcon,
  Package,
  Users,
  Laptop2,
  UserCheck,
  DollarSign,
  BarChart,
  MessageSquare,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { HairsbyIcon, HairsbyLogo } from "../general/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import ProfilePhoto from "../general/profile-photo";
import { useTheme } from "next-themes";

const baseRoutes = [
  { title: "Dashboard", href: "/provider", icon: LayoutDashboard },
  { title: "Bookings", href: "/provider/bookings", icon: Calendar },
  { title: "Orders", href: "/provider/orders", icon: ShoppingBagIcon },
  {
    title: "Services Management",
    href: "/provider/services",
    icon: ScissorsSquareIcon,
  },
  { title: "Products Management", href: "/provider/products", icon: Package },
  { title: "Clients Management", href: "/provider/clients", icon: Users },
  { title: "Financials", href: "/provider/financials", icon: DollarSign },
  { title: "Analytics", href: "/provider/analytics", icon: BarChart },
  { title: "Chat", href: null, icon: MessageSquare },
  { title: "Notifications", href: null, icon: Bell },
  { title: "Settings", href: "/provider/settings", icon: Settings },
];

const businessRoutes = [
  ...baseRoutes.slice(0, 6),
  {
    title: "Business Management",
    href: "/provider/management/organisation",
    icon: Laptop2,
  },
  {
    title: "Specialist Management",
    href: "/provider/management/specialists",
    icon: UserCheck,
  },
  ...baseRoutes.slice(6),
];

export function ProviderSidebar({
  onMenuClick,
  isCollapsed,
  toggleSidebar,
}: {
  onMenuClick?: () => void;
  isCollapsed?: boolean;
  toggleSidebar?: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme } = useTheme();

  const routes = user?.role === "specialist" ? baseRoutes : businessRoutes;

  const renderNavItem = (route: (typeof baseRoutes)[0]) => {
    const isActive =
      pathname === route.href ||
      (pathname.startsWith(`${route.href}/`) && route.href !== "/provider");
    const isDashboardRoot =
      route.href === "/provider" && pathname === "/provider";

    const setCSToLocalStorage = (cs?: string) => {
      if (cs) {
        localStorage.setItem("cs", cs);
        // Force a state update by setting a timestamp
        localStorage.setItem("lastUpdated", Date.now().toString());
      }
    };
    return (
      <TooltipProvider key={route.href}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
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
                  {!isCollapsed && (
                    <span className="whitespace-nowrap">{route.title}</span>
                  )}
                </div>
              ) : (
                <Link
                  href={route.href}
                  className="flex items-center gap-3 py-2"
                >
                  <route.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap">{route.title}</span>
                  )}
                </Link>
              )}
            </Button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent
              side="right"
              className="bg-muted text-foreground border-none"
            >
              <p>{route.title}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="flex h-full flex-col bg-muted text-foreground lg:hidden">
        <div className="p-6 border-b border-border">
          <a href="/" className="flex items-center">
            <HairsbyLogo
              type={`${theme === "light" ? "" : "white"}`}
              className="text-foreground h-8"
            />
          </a>
        </div>
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">{routes.map(renderNavItem)}</div>
        </ScrollArea>
        <UserProfile user={user} />
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex h-full flex-col bg-muted text-foreground transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[80px]" : ""
        )}
      >
        <div
          className={`p-3 pt-4  flex justify-between items-center gap-2 ${isCollapsed ? "flex-col gap-3 pb-1" : "flex-row"}`}
        >
          {isCollapsed ? (
            <HairsbyIcon withLink={false} />
          ) : (
            <HairsbyLogo
              type={`${theme === "light" ? "" : "white"}`}
              className="text-foreground h-8"
            />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground/50"
            onClick={toggleSidebar}
          >
            {!isCollapsed ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </Button>
        </div>
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">{routes.map(renderNavItem)}</div>
        </ScrollArea>
        <UserProfile user={user} collapsed={isCollapsed} />
      </div>
    </>
  );
}
function UserProfile({ user, collapsed }: { user: any; collapsed?: boolean }) {
  return (
    <div
      className={cn(
        "p-2 border-t border-border",
        collapsed ? "flex justify-center" : ""
      )}
    >
      {collapsed ? (
        // Collapsed state - just show avatar
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {user && <ProfilePhoto user={user} />}
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-muted text-foreground border-none"
            >
              <p>
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-foreground">{user?.email}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        // Expanded state - full profile
        <div className="space-y-2">
          {/* User Profile Card */}
          <div className="flex items-center gap-3 group">
            {user && <ProfilePhoto user={user} />}
            <div className="overflow-hidden flex-1">
              <div className="flex items-center justify-between">
                <Link href="/provider/profile">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.businessName ||
                      `${user?.firstName} ${user?.lastName}`}
                  </p>
                </Link>
                <Link href="/provider/settings">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground/60 hover:text-foreground hover:bg-transparent"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              {/* <p className="text-xs text-muted-foreground truncate">{user?.email}</p> */}
              {user?.role && user?.role !== "customer" && (
                <div className="flex items-center justify-between  px-0 py-0 rounded-lg">
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-hairsby-orange animate-pulse" />
                    <span className="text-xs font-medium text-muted-foreground ">
                      {`${user.role[0].toUpperCase()}${user.role.slice(1)} Account`}
                    </span>
                  </div>
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Switch to your customer account"
                      className="text-xs text-hairsby-orange hover:text-hairsby-orange/70 hover:bg-hairsby-orange/20 h-0 px-0"
                    >
                      Switch
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
