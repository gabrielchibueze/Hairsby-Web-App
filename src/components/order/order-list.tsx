"use client";
import { Package, Check, Truck, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Order } from "@/lib/api/products/order";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { OrderStatusBadge } from "./components/order-status-badge";

const statusIcons = {
  processing: <Clock className="h-4 w-4 text-amber-500" />,
  shipped: <Truck className="h-4 w-4 text-blue-500" />,
  delivered: <Check className="h-4 w-4 text-green-500" />,
  cancelled: <X className="h-4 w-4 text-red-500" />,
};

export function OrderList({
  orders,
  status,
  isLoading,
}: {
  orders?: Order[];
  status?: string;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!orders?.length ? (
        <div className="py-8 text-center">
          <Package className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-foreground">
            No orders found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {status ? `You have no ${status} orders` : "You have no orders yet"}
          </p>
          <div className="mt-6">
            <Button asChild className="bg-hairsby-orange hover:bg-amber-500">
              <Link href="/products">Shop Products</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {orders.map((order: Order) => (
            <div
              key={order.id}
              className="rounded-lg border p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">Order #{order.orderCode}</h3>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Package className="h-4 w-4 mr-1" />
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </div>
                    {order.createdAt && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {format(new Date(order.createdAt), "PPP")}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-medium">
                    £{Number(order.totalAmount).toFixed(2)}
                  </span>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link href={`/dashboard/orders/${order.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
