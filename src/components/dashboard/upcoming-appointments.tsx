"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Booking } from "@/lib/api/services/booking";

export function UpcomingAppointments({
  appointments,
}: {
  appointments: Booking[];
}) {
  const statusConfig = {
    pending: {
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      text: "Pending",
    },
    confirmed: {
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      text: "Confirmed",
    },
    cancelled: {
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      text: "Cancelled",
    },
    completed: {
      icon: <UserCheck className="h-5 w-5 text-blue-500" />,
      text: "Completed",
    },
    "no-show": {
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      text: "No Show",
    },
  };

  console.log(appointments);

  return (
    <div className="divide-y divide-gray-100">
      {appointments.length === 0 ? (
        <div className="py-8 pt-2 text-center">
          <Calendar className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No upcoming appointments
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Book your next beauty service to get started
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/services">Book Service</Link>
            </Button>
          </div>
        </div>
      ) : (
        appointments.slice(0, 3).map((appointment, index) => (
          <Link href={`/dashboard/bookings/${appointment.id}`}>
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center p-4 hover:bg-gray-50"
            >
              <div className="flex-shrink-0">
                {statusConfig[appointment.status].icon}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {`Service${appointment.services?.length > 1 ? "s" : ""}`}:{" "}
                    {appointment.services?.length > 0 &&
                      appointment.services
                        .map((service) => service.name)
                        .join(", ")}
                  </h3>
                  {/* {appointment.services.length > 0 &&
                  appointment?.services[0].name} */}
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">
                      {statusConfig[appointment.status].text}
                    </span>
                    <span className="text-xs text-gray-500">
                      {appointment.time}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  with{" "}
                  {appointment.provider.businessName ||
                    `${appointment.provider.firstName} ${appointment.provider.lastName}`}
                </p>
                <div className="mt-1 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {new Date(appointment.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs font-medium">
                    £{Number(appointment.totalAmount).toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          </Link>
        ))
      )}
      {appointments.length > 3 && (
        <div className="p-4 text-center">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/bookings">View all appointments</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
