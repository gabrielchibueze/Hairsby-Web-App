"use client";

import { Badge } from "@/components/ui/badge";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      class: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    },
    paid: {
      label: "Paid",
      class: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    failed: {
      label: "Failed",
      class: "bg-red-100 text-red-800 hover:bg-red-100",
    },
    refunded: {
      label: "Refunded",
      class: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
  };

  return (
    <Badge className={cn(statusConfig[status].class, "capitalize", className)}>
      {statusConfig[status].label}
    </Badge>
  );
}

function cn(...args: any[]) {
  return args.filter(Boolean).join(" ");
}
