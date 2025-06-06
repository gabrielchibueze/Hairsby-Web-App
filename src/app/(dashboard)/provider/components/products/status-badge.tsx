"use client";

import { Badge } from "@/components/ui/badge";

type Status = "active" | "inactive" | "out_of_stock";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function ProductStatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      label: "Active",
      class: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    inactive: {
      label: "Inactive",
      class: "bg-muted text-foreground/90 hover:bg-muted",
    },
    out_of_stock: {
      label: "Out of Stock",
      class: "bg-red-100 text-red-800 hover:bg-red-100",
    },
  };

  return (
    <Badge className={`${statusConfig[status].class} capitalize ${className}`}>
      {statusConfig[status].label}
    </Badge>
  );
}
