"use client"

import { motion } from "framer-motion"
import { Package } from "lucide-react"

interface TopServicesProps {
  services: Array<{
    id: string
    name: string
    bookings: number
    revenue: number
  }>
}

export function TopServices({ services }: TopServicesProps) {
  if (!services?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">No services data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {services.map((service, index) => (
        <motion.div
          key={service.id}
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
              <h4 className="font-medium">{service.name}</h4>
              <p className="text-sm text-muted-foreground">
                {service.bookings} bookings
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">£{service.revenue.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Revenue</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}