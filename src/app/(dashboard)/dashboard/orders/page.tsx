"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Filter, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getOrders } from "@/lib/api/products/order";

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", statusFilter],
    queryFn: () => getOrders({ status: statusFilter }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>
        <Button asChild>
          <a href="/products">Shop Products</a>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
        {/* Filters */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {/* Mobile Filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </SheetContent>
          </Sheet>

          {/* Orders Grid */}
          <div className="grid gap-4">
            {orders.map((order: any, index: number) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Order #{order.id}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Placed on {format(new Date(order.date), "PP")}
                        </p>
                        <p className="font-medium">£{order.total.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col gap-2 sm:items-end">
                        <div
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            order.status === "processing" &&
                              "bg-blue-100 text-blue-800",
                            order.status === "shipped" &&
                              "bg-yellow-100 text-yellow-800",
                            order.status === "delivered" &&
                              "bg-green-100 text-green-800",
                            order.status === "cancelled" &&
                              "bg-red-100 text-red-800"
                          )}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </div>
                        {order.status === "shipped" && order.trackingNumber && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Truck className="h-4 w-4" />
                            <span>Tracking: {order.trackingNumber}</span>
                          </div>
                        )}
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/dashboard/orders/${order.id}`}>
                            View Details
                          </a>
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium">Items</h4>
                      <ul className="mt-2 space-y-1">
                        {order.items.map((item: any) => (
                          <li
                            key={item.name}
                            className="text-sm text-muted-foreground"
                          >
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
