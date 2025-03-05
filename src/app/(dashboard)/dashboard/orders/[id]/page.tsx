"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOrderById } from "@/lib/api/orders";

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", params.id],
    queryFn: () => getOrderById(params.id),
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="mb-6" asChild>
        <a href="/dashboard/orders">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </a>
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>View your order information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Order Number</h3>
                <p className="text-muted-foreground">#{order.id}</p>
              </div>
              <div>
                <h3 className="font-medium">Date</h3>
                <p className="text-muted-foreground">
                  {format(new Date(order.date), "PP")}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <Badge
                  variant={
                    order.status === "delivered"
                      ? "success"
                      : order.status === "cancelled"
                        ? "destructive"
                        : "default"
                  }
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium">Total</h3>
                <p className="text-xl font-bold">£{order.total.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Shipping Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
              <CardDescription>
                Delivery information and tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Shipping Address</h3>
                <p className="text-muted-foreground">
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
              </div>
              {order.trackingNumber && (
                <div>
                  <h3 className="font-medium">Tracking Number</h3>
                  <div className="flex items-center text-muted-foreground">
                    <Truck className="mr-2 h-4 w-4" />
                    {order.trackingNumber}
                  </div>
                </div>
              )}
              {order.estimatedDeliveryDate && (
                <div>
                  <h3 className="font-medium">Estimated Delivery</h3>
                  <p className="text-muted-foreground">
                    {format(new Date(order.estimatedDeliveryDate), "PP")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Items */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Products included in your order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
