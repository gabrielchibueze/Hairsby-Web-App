"use client"

import { motion } from "framer-motion"
import { format } from "date-fns"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OrdersProps {
  orders: Array<{
    id: string
    date: string
    total: number
    status: string
    items: Array<{
      name: string
      quantity: number
    }>
  }>
}

export function RecentOrders({ orders }: OrdersProps) {
  if (!orders?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">No recent orders</p>
        <Button className="mt-4" asChild>
          <a href="/products">Shop Now</a>
        </Button>
      </div>
    )
  }

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
              <h4 className="font-medium">
                {order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {format(new Date(order.date), "PP")}
              </p>
              <p className="text-sm font-medium">£{order.total.toFixed(2)}</p>
            </div>
          </div>
          <div>
            <Button variant="outline" size="sm" asChild>
              <a href={`/dashboard/orders/${order.id}`}>View Order</a>
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}