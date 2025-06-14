"use client";

import { motion } from "framer-motion";
import { Order } from "@/lib/api/products/order";
import { PackageIcon, Check, X, Clock, Truck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/general/status-badge";
import { OrderStatusBadge } from "@/components/order/components/order-status-badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentOrdersProps {
  orders: Order[];
  loading?: boolean;
  onEditOrder?: (order: Order) => void;
  onViewDetails?: (order: Order) => void;
  account?: string;
}

export function RecentOrders({
  orders,
  loading = false,
  onViewDetails,
  onEditOrder,
  account,
}: RecentOrdersProps) {
  const statusConfig = {
    pending: {
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      text: "Processing",
    },
    processing: {
      icon: <Clock className="h-4 w-4 text-amber-500" />,
      text: "Processing",
    },
    shipped: {
      icon: <Truck className="h-4 w-4 text-blue-500" />,
      text: "Shipped",
    },
    delivered: {
      icon: <Check className="h-4 w-4 text-green-500" />,
      text: "Delivered",
    },
    cancelled: {
      icon: <X className="h-4 w-4 text-red-500" />,
      text: "Cancelled",
    },
  };

  if (loading) {
    return (
      <div className="space-y-4 flex flex-col gap-0">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="mt-2 flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="mt-2">
              <Skeleton className="h-3 w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 flex flex-col gap-0">
      {orders.length === 0 ? (
        <div className="py-2 text-center">
          <PackageIcon className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <h3 className="mt-2 text-sm font-medium text-foreground">
            No recent orders
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your order history will appear here. Enter a new order
          </p>
          <div className="mt-6">
            <Link href="/products">
              <Button variant="brand">New order</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {orders.slice(0, 3).map((order, index) => (
            <Link key={order.id} href={`/${account}/orders/${order.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg border p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {statusConfig[order.status as keyof typeof statusConfig]
                      ?.icon || <PackageIcon className="h-4 w-4" />}
                    <span className="text-sm font-medium">
                      Order #{order.orderCode}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    £{Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                  <span>
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </span>
                  <span>
                    {order.createdAt &&
                      new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                  </span>
                </div>
                <div className="mt-2 text-xs font-medium">
                  {statusConfig[order.status as keyof typeof statusConfig]
                    ?.text || order.status}
                </div>
              </motion.div>
            </Link>
          ))}
          {orders.length > 3 && (
            <div className="pt-4 text-center">
              <Button variant="ghost" asChild>
                <Link href={`/${account}/orders`}>View all orders</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
