// Create a new product order confirmation page
"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import { Check, Download, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOrderById } from "@/lib/api/orders";

export default function OrderConfirmationPage() {
  const { data: order } = useQuery({
    queryKey: ["order"],
    queryFn: () => getOrderById("latest"), // Get the most recent order
  });

  if (!order) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
        >
          <Check className="h-12 w-12 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">
            Your order has been successfully placed
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Order #{order.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Items */}
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        £{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Details */}
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Shipping Details</h3>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {order.shippingAddress}
                </div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Truck className="mr-2 h-4 w-4" />
                  Estimated delivery: {order.estimatedDeliveryDate}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center space-x-4">
                <Button asChild>
                  <a href="/dashboard/orders">View Orders</a>
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
