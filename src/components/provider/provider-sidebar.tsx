"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Calendar,
  Package,
  Users,
  DollarSign,
  Settings,
  BarChart,
  MessageSquare,
  Bell,
  PackageOpen,
  ScissorsSquareIcon,
} from "lucide-react";

const routes = [
  {
    title: "Dashboard",
    href: "/provider",
    icon: LayoutDashboard,
  },
  {
    title: "Appointments",
    href: "/provider/appointments",
    icon: Calendar,
  },
  {
    title: "Services",
    href: "/provider/services",
    icon: ScissorsSquareIcon,
  },
  {
    title: "Products",
    href: "/provider/products",
    icon: PackageOpen,
  },
  {
    title: "Clients",
    href: "/provider/clients",
    icon: Users,
  },
  {
    title: "Earnings",
    href: "/provider/earnings",
    icon: DollarSign,
  },
  {
    title: "Analytics",
    href: "/provider/analytics",
    icon: BarChart,
  },
  {
    title: "Messages",
    href: "/provider/messages",
    icon: MessageSquare,
  },
  {
    title: "Notifications",
    href: "/provider/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/provider/settings",
    icon: Settings,
  },
];

export function ProviderSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r">
      <div className="p-6">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold">Hairsby Provider</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === route.href && "bg-secondary"
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-4 w-4" />
                {route.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
