"use client";

import { Order } from "@/lib/api/products/order";
import { Button } from "@/components/ui/button";
import { Pencil, Eye, Package } from "lucide-react";
import { format } from "date-fns";
import { OrderStatusBadge } from "./order-status-badge";
import { useRouter } from "next/navigation";
import { formatCurrency, safeFormatDate } from "@/lib/utils";

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
            <h3 className="font-medium text-sm">#{order.orderCode}</h3>
            <p className="text-sm text-muted-foreground">
              {safeFormatDate(order.createdAt || new Date(), "MMM d, yyyy")}
            </p>
            <p className="text-sm text-muted-foreground">
              {order?.customer?.firstName} {order?.customer?.lastName}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <OrderStatusBadge
              status={order.status}
              paymentStatus={order.paymentStatus}
            />
          </div>
        </div>

        <div className="space-y-2 ">
          {/* <div className="text-sm flex justify-between gap-4">
            <span className="font-medium text-muted-foreground ">
              Customer{" "}
            </span>
            <span>
              {order.customer?.firstName} {order.customer?.lastName}
            </span>{" "}
          </div> */}
          <div>
            <h2 className="text-sm font-bold mb-2">Products</h2>
            <table className="w-full text-xs border-border">
              <thead className="">
                <tr>
                  <th className="px-3 py-2 text-left border">#</th>
                  <th className="px-3 py-2 text-left border">Name</th>
                  {/* <th className="px-3 py-2 text-left border">Duration</th> */}
                  <th className="px-3 py-2 text-left border">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((product, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-3 py-2 border">{index + 1}</td>
                    <td className="px-3 py-2 border font-medium">
                      {product.name}
                    </td>
                    {/* <td className="px-3 py-2 border">
                      {formatDuration(service?.duration)}
                    </td> */}
                    <td className="px-3 py-2 border">
                      {formatCurrency(
                        Number(product.price).toFixed(2),
                        product?.currency!
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <div className="text-sm">
            <span className="font-medium">Items: </span>
            {order.items?.length} product{order.items?.length !== 1 ? "s" : ""}
          </div> */}
          <div className="text-sm flex justify-between">
            <span className="font-medium text-muted-foreground">Total </span>
            <span>
              {formatCurrency(
                Number(order.totalAmount).toFixed(2),
                order?.currency!
              )}
            </span>
          </div>
          {order.trackingNumber && (
            <div className="text-sm flex justify-between">
              <span className="font-medium text-muted-foreground">
                Tracking{" "}
              </span>
              <a
                target="__blank"
                href={order?.trackingNumber}
                className="underline text-hairsby-orange/90"
              >
                Parcel Track
              </a>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
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
                variant="brand"
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
