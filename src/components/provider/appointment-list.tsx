"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AppointmentListProps {
  appointments: Array<{
    id: string
    date: string
    time: string
    service: {
      name: string
      duration: number
    }
    customer: {
      name: string
      photo: string
    }
    status: string
  }>
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  if (!appointments?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">No upcoming appointments</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment, index) => (
        <motion.div
          key={appointment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex items-center justify-between rounded-lg border p-4"
        >
          <div className="flex items-center space-x-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src={appointment.customer.photo}
                alt={appointment.customer.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium">{appointment.customer.name}</h4>
              <p className="text-sm text-muted-foreground">
                {appointment.service.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(`${appointment.date}T${appointment.time}`), "PPp")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                appointment.status === "confirmed"
                  ? "success"
                  : appointment.status === "cancelled"
                  ? "destructive"
                  : "default"
              }
            >
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Badge>
            <Button variant="outline" size="sm" asChild>
              <a href={`/provider/appointments/${appointment.id}`}>View</a>
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}