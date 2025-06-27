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
  PanelLeftOpen,
  PanelLeftClose,
  UserCog,
  School,
} from "lucide-react";
import { HairsbyIcon, HairsbyLogo } from "../general/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { Avatar } from "../ui/avatar";

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
  {
    title: "Clients Management",
    href: "/provider/management/clients",
    icon: Users,
  },
  {
    title: "My Organisations",
    href: "/provider/management/organisations",
    icon: Laptop2,
  },
  { title: "Analytics", href: "/provider/analytics", icon: BarChart },
  { title: "Chat & Support", href: null, icon: MessageSquare },
  { title: "Notifications", href: null, icon: Bell },
  { title: "Account", href: "/provider/account", icon: UserCog },
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
  const businessRoutes = [
    ...baseRoutes.slice(0, 6),
    {
      title: "Specialist Management",
      href: "/provider/management/specialists",
      icon: UserCheck,
    },
    ...(!user?.isBusinessBranch
      ? [
          {
            title: "Branch Management",
            href: "/provider/management/branches",
            icon: School,
          },
        ]
      : []),
    ...baseRoutes.slice(7),
  ];

  const routes = user?.role === "specialist" ? baseRoutes : businessRoutes;

  const setCSToLocalStorage = (cs?: string) => {
    if (cs) {
      localStorage.setItem("cs", cs === "chat & support" ? "chat" : cs);
      localStorage.setItem("lastUpdated", Date.now().toString());
    }
  };

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
            <div>
              {!route.href ? (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full  hidden sm:flex justify-start hover:bg-provider-sidebar-accent",
                    "text-provider-sidebar-muted hover:text-provider-sidebar-foreground px-4 py-2.5",
                    isCollapsed ? "justify-center px-0" : "px-4",

                    (isActive || isDashboardRoot) &&
                      "bg-hairsby-orange/10 hover:bg-hairsby-orange/10 text-hairsby-orange font-medium"
                  )}
                  onClick={() => {
                    onMenuClick?.();
                    setCSToLocalStorage(route.title.toLowerCase());
                  }}
                >
                  <route.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 whitespace-nowrap">
                      {route.title}
                    </span>
                  )}
                </Button>
              ) : (
                <Link href={route.href} className="w-full">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start hover:bg-provider-sidebar-accent",
                      "text-provider-sidebar-muted hover:text-provider-sidebar-foreground",
                      isCollapsed ? "justify-center px-0" : "px-4",

                      (isActive || isDashboardRoot) &&
                        "bg-hairsby-orange/10 hover:bg-hairsby-orange/10 text-hairsby-orange font-medium"
                    )}
                    onClick={onMenuClick}
                  >
                    <route.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-3 whitespace-nowrap">
                        {route.title}
                      </span>
                    )}
                  </Button>
                </Link>
              )}
            </div>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent
              side="right"
              className="bg-provider-sidebar-background text-provider-sidebar-foreground border-provider-sidebar-border"
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
      <div className="lg:hidden flex h-full flex-col bg-provider-sidebar-background text-provider-sidebar-foreground border-r border-provider-sidebar-border">
        <div className="p-6 border-b border-provider-sidebar-border">
          <HairsbyLogo
            type={`${theme === "light" ? "" : "white"}`}
            className="h-4"
          />
        </div>
        <ScrollArea className="flex-1 px-4 py-2">
          <div className="space-y-1">{routes.map(renderNavItem)}</div>
        </ScrollArea>
        <UserProfile user={user} />
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex h-full flex-col bg-provider-sidebar-background text-provider-sidebar-foreground border-r border-provider-sidebar-border",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div
          className={`p-6 pt-4 ${!isCollapsed ? " border-b border-provider-sidebar-border pb-3 " : ""} flex justify-between items-center gap-2 ${isCollapsed ? "flex-col gap-3 pb-0 -mb-3" : "flex-row"}`}
        >
          {isCollapsed ? (
            <HairsbyIcon withLink={false} />
          ) : (
            <HairsbyLogo
              type={`${theme === "light" ? "" : "white"}`}
              className="text-foreground h-6"
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
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="space-y-1.5">{routes.map(renderNavItem)}</div>
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
        "p-4 py-2 border-t border-provider-sidebar-border",
        collapsed ? "flex justify-center" : ""
      )}
    >
      {collapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar
                size="sm"
                src={user.photo}
                alt={`${user.firstName} ${user.lastName}`}
                fallback={
                  <>
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </>
                }
              />
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-provider-sidebar-background text-provider-sidebar-foreground border-provider-sidebar-border"
            >
              <p className="font-medium">
                {user?.businessName || `${user?.firstName} ${user?.lastName}`}
              </p>
              <p className="text-xs text-provider-sidebar-muted">
                {user?.email}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="flex items-center gap-3 -pr-2">
          <Avatar
            size="sm"
            src={user?.photo}
            alt={`${user.firstName} ${user.lastName}`}
            fallback={
              <>
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </>
            }
          />
          <div className="flex-1 overflow-hidden ">
            <div className="flex items-center justify-between">
              <Link href="/provider/account?t=profile">
                <p className="text-sm font-medium truncate">
                  {user?.businessName || `${user?.firstName} ${user?.lastName}`}
                </p>
              </Link>
              <Link href="/provider/account?t=settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-provider-sidebar-muted hover:text-provider-sidebar-foreground"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            {user?.role && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-hairsby-orange" />
                  <span className="text-xs text-provider-sidebar-muted capitalize">
                    {user.role} account
                  </span>
                </div>
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2 text-hairsby-orange hover:bg-hairsby-orange/10"
                    title={`Switch to your customer account`}
                  >
                    Switch
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
