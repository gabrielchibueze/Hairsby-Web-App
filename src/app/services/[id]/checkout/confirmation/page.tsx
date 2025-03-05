"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import Image from "next/image"
import { format } from "date-fns"
import {  as Calendar,  as Check,  as Clock,  as Download,  as MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getBookingById } from "@/lib/api/bookings"

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const { data: booking } = useQuery({
    queryKey: ["booking", params.id],
    queryFn: () => getBookingById(params.id),
  })

  if (!booking) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
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
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">
            Your appointment has been successfully booked
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
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>
                Save these details for your records
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                  <Image
                    src={booking.service.images[0]}
                    alt={booking.service.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">{booking.service.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.service.provider.businessName}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 text-left text-sm sm:grid-cols-2">
                <div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(booking.date), "PPP")}
                  </div>
                  <div className="mt-2 flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {format(new Date(`2000-01-01T${booking.time}`), "p")}
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    {booking.service.provider.address}
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button asChild>
                  <a href="/dashboard/appointments">View Appointments</a>
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}