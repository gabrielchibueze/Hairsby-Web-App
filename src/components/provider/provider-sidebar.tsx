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
  { title: "Financial", href: "/provider/financial", icon: DollarSign },
  { title: "Analytics", href: "/provider/analytics", icon: BarChart },
  { title: "Chat", href: "/provider/messages", icon: MessageSquare },
  { title: "Notifications", href: "/provider/notifications", icon: Bell },
  { title: "Settings", href: "/provider/settings", icon: Settings },
];

const businessRoutes = [
  ...baseRoutes.slice(0, 6),
  {
    title: "Business Management",
    href: "/provider/business-management",
    icon: Laptop2,
  },
  {
    title: "Specialist Management",
    href: "/provider/specialist-management",
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
  const routes = user?.role === "specialist" ? baseRoutes : businessRoutes;

  const renderNavItem = (route: (typeof baseRoutes)[0]) => {
    const isActive =
      pathname === route.href ||
      (pathname.startsWith(`${route.href}/`) && route.href !== "/provider");
    const isDashboardRoot =
      route.href === "/provider" && pathname === "/provider";

    return (
      <TooltipProvider key={route.href}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-white hover:bg-hairsby-orange/40 hover:text-white transition-colors rounded-lg",
                (isActive || isDashboardRoot) &&
                  "bg-hairsby-orange text-hairsby-dark hover:bg-hairsby-orange font-medium",
                isCollapsed ? "justify-center px-0" : "px-4"
              )}
              asChild
              onClick={onMenuClick}
            >
              <Link href={route.href} className="flex items-center gap-3 py-2">
                <route.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="whitespace-nowrap">{route.title}</span>
                )}
              </Link>
            </Button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent
              side="right"
              className="bg-hairsby-dark text-white border-none"
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
      <div className="flex h-full flex-col bg-hairsby-dark text-white lg:hidden">
        <div className="p-6 border-b border-[#1e293b]">
          <Link href="/" className="flex items-center">
            <HairsbyLogo type="white" className="text-white h-8" />
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">{routes.map(renderNavItem)}</div>
        </ScrollArea>
        <UserProfile user={user} />
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex h-full flex-col bg-hairsby-dark text-white transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[80px]" : ""
        )}
      >
        <div className="p-4 py-6 border-b border-[#1e293b] flex justify-between items-center gap-2">
          {isCollapsed ? (
            <HairsbyIcon width={32} height={32} withLink={false} />
          ) : (
            <HairsbyLogo type="white" />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-hairsby-orange/40 hover:text-white"
            onClick={toggleSidebar}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </Button>
        </div>
        <ScrollArea className="flex-1 px-0">
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
        "p-2 border-t border-[#1e293b] ",
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
              className="bg-hairsby-dark text-white border-none"
            >
              <p>
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-gray-400">{user?.email}</p>
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
                {user?.businessName ? (
                  <p className="text-sm font-medium text-white truncate">
                    {user?.businessName}
                  </p>
                ) : (
                  <p className="text-sm font-medium text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                )}
                <Link href="/provider/settings">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-white hover:bg-transparent"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Account Type Badge - Only for business/specialist */}
          {user?.role && user?.role !== "customer" && (
            <div className="flex items-center justify-between bg-[#192333] px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-hairsby-orange animate-pulse" />
                <span className="text-xs font-medium text-white">
                  {`${user.role[0].toUpperCase()}${user.role.slice(1)} Account`}
                </span>
              </div>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  title="Switch to your customer account"
                  className="text-xs text-hairsby-orange hover:text-white hover:bg-hairsby-orange/20 h-6 px-2"
                >
                  Switch
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
