"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBookingDetails } from "@/lib/api/services/booking";

export default function AppointmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: appointment, isLoading } = useQuery({
    queryKey: ["appointment", params.id],
    queryFn: () => getBookingDetails(params.id),
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
        <a href="/dashboard/appointments">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Appointments
        </a>
      </Button>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appointment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>
                View your appointment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Service</h3>
                <p className="text-muted-foreground">
                  {appointment.service.name}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Duration</h3>
                <p className="text-muted-foreground">
                  {appointment.service.duration} minutes
                </p>
              </div>
              <div>
                <h3 className="font-medium">Date & Time</h3>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(
                    new Date(`${appointment.date}T${appointment.time}`),
                    "PPp"
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <Badge
                  variant={
                    appointment.status === "confirmed"
                      ? "success"
                      : appointment.status === "cancelled"
                        ? "destructive"
                        : "default"
                  }
                >
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Provider Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Provider Details</CardTitle>
              <CardDescription>
                Information about your service provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Business Name</h3>
                <p className="text-muted-foreground">
                  {appointment.provider.businessName}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Location</h3>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {appointment.provider.address}
                </div>
              </div>
              <div>
                <h3 className="font-medium">Contact</h3>
                <p className="text-muted-foreground">
                  {appointment.provider.phone}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a href={`/messages/${appointment.provider.id}`}>
                    Message Provider
                  </a>
                </Button>
                {appointment.status === "confirmed" && (
                  <Button variant="outline" asChild>
                    <a
                      href={`/dashboard/appointments/${appointment.id}/reschedule`}
                    >
                      Reschedule
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
