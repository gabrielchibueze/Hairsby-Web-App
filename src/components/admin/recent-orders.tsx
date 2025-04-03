"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Package } from "lucide-react";

interface RecentOrdersProps {
  orders: Array<{
    id: string;
    customer: {
      name: string;
      email: string;
    };
    amount: number;
    status: string;
    date: string;
  }>;
}

export function AdminRecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">{order.customer.name}</h4>
              <p className="text-sm text-muted-foreground">
                {order.customer.email}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">£{order.amount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(order.date), "PP")}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
