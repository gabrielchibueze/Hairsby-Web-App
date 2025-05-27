"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Package,
  Check,
  Truck,
  X,
  Clock,
  CreditCard,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getOrderById } from "@/lib/api/products/order";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { OrderActions } from "./order-actions";

export function OrderDetails({ id }: { id: string }) {
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-8 text-center">
        <X className="mx-auto h-8 w-8 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-foreground">
          Order not found
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The order you're looking for doesn't exist
        </p>
        <div className="mt-6">
          <Button asChild className="bg-hairsby-orange hover:bg-amber-500">
            <Link href="/orders">View All Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderCode}</h1>
          <Badge variant="outline" className="mt-2">
            {order.status}
          </Badge>
        </div>
        <span className="text-xl font-bold">
          £{Number(order.totalAmount).toFixed(2)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Order Items */}
          <div className="rounded-lg border p-4">
            <h2 className="font-medium mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.productId} className="flex items-start gap-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
                    {/* Product image would go here */}
                    <Package className="h-full w-full text-muted-foreground p-3" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="mt-1 flex items-center gap-4 text-sm">
                      <span>Qty: {item.quantity}</span>
                      <span>£{Number(item.price).toFixed(2)} each</span>
                    </div>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/products/${item.productId}`}>
                          View Product
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="rounded-lg border p-4">
            <h2 className="font-medium mb-4">Order Timeline</h2>
            <div className="space-y-3">
              {order.createdAt && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), "PPPp")}
                    </p>
                  </div>
                </div>
              )}
              {order.status === "shipped" && order.trackingNumber && (
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Shipped</p>
                    <p className="text-sm text-muted-foreground">
                      Tracking: {order.trackingNumber}
                    </p>
                  </div>
                </div>
              )}
              {order.status === "delivered" && (
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Delivered</p>
                    {order.updatedAt && (
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.updatedAt), "PPPp")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shipping and Payment Details */}
        <div className="space-y-6">
          {order.shippingAddress && (
            <div className="rounded-lg border p-4">
              <h2 className="font-medium mb-4">Shipping Details</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg border p-4">
            <h2 className="font-medium mb-4">Payment Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    order.paymentStatus === "paid" ? "default" : "outline"
                  }
                  className={
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : ""
                  }
                >
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OrderActions order={order} />
    </div>
  );
}
