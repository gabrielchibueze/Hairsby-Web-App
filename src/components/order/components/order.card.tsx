"use client";

import { Order } from "@/lib/api/products/order";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Package } from "lucide-react";
import { format } from "date-fns";
import { OrderStatusBadge } from "./order-status-badge";
import { useRouter } from "next/navigation";

interface OrderCardProps {
  order: Order;
  onEdit: () => void | null;
  onViewDetails: () => void | null;
  inDetails?: boolean;
}

export function OrderCard({
  order,
  onEdit,
  onViewDetails,
  inDetails = false,
}: OrderCardProps) {
  const router = useRouter();
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-card">
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">Order #{order.orderCode}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(order.createdAt || new Date()), "MMM d, yyyy")}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <OrderStatusBadge
              status={order.status}
              paymentStatus={order.paymentStatus}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Customer: </span>
            {order.customer?.firstName} {order.customer?.lastName}
          </div>
          <div className="text-sm">
            <span className="font-medium">Items: </span>
            {order.items?.length} product{order.items?.length !== 1 ? "s" : ""}
          </div>
          <div className="text-sm">
            <span className="font-medium">Total: </span>£
            {Number(order.totalAmount).toFixed(2)}
          </div>
          {order.trackingNumber && (
            <div className="text-sm">
              <span className="font-medium">Tracking: </span>
              <a
                target="__blank"
                href={order?.trackingNumber}
                className="underline text-hairsby-orange/80"
              >
                Parcel Track{" "}
              </a>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="brandline"
            size="sm"
            onClick={() =>
              inDetails
                ? router.push(`/provider/orders/${order.id}`)
                : onViewDetails?.()
            }
          >
            <Eye className="h-4 w-4 mr-2" />
            Details
          </Button>
          {(order.status === "processing" || order.status === "pending") &&
            !inDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  inDetails
                    ? router.push(`/provider/orders/${order.id}/edit`)
                    : onEdit?.()
                }
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
