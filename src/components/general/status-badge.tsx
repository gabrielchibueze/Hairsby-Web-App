"use client";

import { cn } from "@/lib/utils";
import { Product } from "@/lib/api/products/product";

interface StatusBadgeProps {
  status: Product["status"];
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusMap = {
    active: {
      label: "Active",
      color: "bg-green-100 text-green-800",
    },
    inactive: {
      label: "Inactive",
      color: "bg-gray-100 text-gray-800",
    },
    out_of_stock: {
      label: "Out of Stock",
      color: "bg-red-100 text-red-800",
    },
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        statusMap[status].color,
        className
      )}
    >
      {statusMap[status].label}
    </span>
  );
}
