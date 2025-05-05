"use client";

import { cn } from "@/lib/utils";
import { Order } from "@/lib/api/products/order";

interface StatusStyle {
  text: string;
  bg: string;
  textColor: string;
}

interface OrderStatusBadgeProps {
  status?: Order["status"];
  paymentStatus?: Order["paymentStatus"];
  className?: string;
}

const statusMap = {
  pending: {
    text: "Pending",
    bg: "bg-amber-100",
    textColor: "text-amber-800",
  },
  processing: {
    text: "Processing",
    bg: "bg-blue-100",
    textColor: "text-blue-800",
  },
  shipped: {
    text: "Shipped",
    bg: "bg-indigo-100",
    textColor: "text-indigo-800",
  },
  delivered: {
    text: "Delivered",
    bg: "bg-green-100",
    textColor: "text-green-800",
  },
  pickedup: {
    text: "Picked Up",
    bg: "bg-green-100",
    textColor: "text-green-800",
  },
  cancelled: {
    text: "Cancelled",
    bg: "bg-red-100",
    textColor: "text-red-800",
  },
  refunded: {
    text: "Refunded",
    bg: "bg-purple-100",
    textColor: "text-purple-800",
  },
} as const;

const paymentStatusMap = {
  pending: {
    text: "Payment Pending",
    bg: "bg-amber-100",
    textColor: "text-amber-800",
  },
  partial: {
    text: "Partial Payment",
    bg: "bg-blue-100",
    textColor: "text-blue-800",
  },
  paid: {
    text: "Paid",
    bg: "bg-green-100",
    textColor: "text-green-800",
  },
  refunded: {
    text: "Refunded",
    bg: "bg-purple-100",
    textColor: "text-purple-800",
  },
} as const;

export function OrderStatusBadge({
  status,
  paymentStatus,
  className,
}: OrderStatusBadgeProps) {
  const statusStyle = statusMap[status as keyof typeof statusMap];
  const paymentStyle = paymentStatus
    ? paymentStatusMap[paymentStatus as keyof typeof paymentStatusMap]
    : null;
  console.log("Payment Status", paymentStatus);
  console.log("Payment Style", paymentStyle);
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {statusStyle && (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            statusStyle.bg,
            statusStyle.textColor
          )}
        >
          {statusStyle.text}
        </span>
      )}
      {paymentStyle && (
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            paymentStyle.bg,
            paymentStyle.textColor
          )}
        >
          {paymentStyle.text}
        </span>
      )}
    </div>
  );
}
