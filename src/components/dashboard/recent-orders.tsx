"use client";

import { motion } from "framer-motion";
import { Package, Check, X, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Order } from "@/lib/api/products/order";

export function RecentOrders({ orders }: { orders: Order[] }) {
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

  return (
    <div className="space-y-4 flex flex-col gap-0">
      {orders.length === 0 ? (
        <div className="py-2 text-center">
          <Package className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-foreground">
            No recent orders
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your order history will appear here
          </p>
          <div className="mt-6">
            <Link href="/products">
              <Button variant="brand">Shop Products</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {orders.slice(0, 3).map((order, index) => (
            <Link href={`/dashboard/orders/${order.id}`}>
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg border p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {statusConfig[order.status as keyof typeof statusConfig]
                      ?.icon || <Package className="h-4 w-4" />}
                    <span className="text-sm font-medium">
                      Order #{order.orderCode}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    £{order.totalAmount.toFixed(2)}
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
                <Link href="/dashboard/orders">View all orders</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
