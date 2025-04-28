"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      class: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    },
    processing: {
      label: "Processing",
      class: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
    shipped: {
      label: "Shipped",
      class: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    },
    delivered: {
      label: "Delivered",
      class: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    cancelled: {
      label: "Cancelled",
      class: "bg-red-100 text-red-800 hover:bg-red-100",
    },
  };

  return (
    <Badge className={cn(statusConfig[status].class, "capitalize", className)}>
      {statusConfig[status].label}
    </Badge>
  );
}

// function cn(...args: any[]) {
//   return args.filter(Boolean).join(" ");
// }
