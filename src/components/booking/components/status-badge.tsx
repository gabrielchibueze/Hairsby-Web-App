"use client";

import { Badge } from "@/components/ui/badge";

type Status = "pending" | "confirmed" | "cancelled" | "completed" | "no-show";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function BookingStatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      class: "bg-amber-100 text-amber-800 hover:bg-amber-100",
      icon: null,
    },
    confirmed: {
      label: "Confirmed",
      class: "bg-green-100 text-green-800 hover:bg-green-100",
      icon: null,
    },
    cancelled: {
      label: "Cancelled",
      class: "bg-red-100 text-red-800 hover:bg-red-100",
      icon: null,
    },
    completed: {
      label: "Completed",
      class: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      icon: null,
    },
    "no-show": {
      label: "No Show",
      class: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      icon: null,
    },
  };

  return (
    <Badge className={cn(statusConfig[status].class, "capitalize", className)}>
      {statusConfig[status].label}
    </Badge>
  );
}

function cn(...args: any[]) {
  return args?.filter(Boolean).join(" ");
}
