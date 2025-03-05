"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"

interface AppointmentProps {
  appointments: Array<{
    id: string
    date: string
    time: string
    service: {
      name: string
      duration: number
    }
    provider: {
      id: string
      businessName: string
      photo: string
    }
    status: string
  }>
}

export function UpcomingAppointments({ appointments }: AppointmentProps) {
  if (!appointments?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-muted-foreground">No upcoming appointments</p>
        <Button className="mt-4" asChild>
          <a href="/services">Book Now</a>
        </Button>
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
                src={appointment.provider.photo}
                alt={appointment.provider.businessName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium">{appointment.service.name}</h4>
              <p className="text-sm text-muted-foreground">
                {appointment.provider.businessName}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(`${appointment.date}T${appointment.time}`), "PPp")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`/dashboard/appointments/${appointment.id}`}>View</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`/dashboard/appointments/${appointment.id}/reschedule`}>
                Reschedule
              </a>
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}