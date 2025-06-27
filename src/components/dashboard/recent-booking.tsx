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
import { truncate } from "@/lib/utils";

export function RecentBookings({ bookings }: { bookings: Booking[] }) {
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

  console.log(bookings);

  return (
    <div className="divide-y ">
      {bookings.length === 0 ? (
        <div className="py-2 text-center">
          <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-foreground">
            No upcoming bookings
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Book your next professional service to get started
          </p>
          <div className="mt-6">
            <Button variant="brand">
              <Link href="/services">Book Service</Link>
            </Button>
          </div>
        </div>
      ) : (
        bookings.slice(0, 3).map((appointment, index) => (
          <Link href={`/dashboard/bookings/${appointment.id}`}>
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center p-4 pl-0 hover:bg-background"
            >
              <div className="flex-shrink-0">
                {statusConfig[appointment.status].icon}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">
                    {/* {`Service${appointment.items.length > 1 ? "s" : ""}`}:{" "} */}
                    {truncate(
                      appointment.items
                        .slice(0, 1)
                        .map((service) => service.name)
                        .join(", "),
                      30
                    )}
                    {appointment.items.length > 1 &&
                      ` +${appointment.items.length - 1}`}
                  </h4>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-2">
                      {statusConfig[appointment.status].text}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {appointment.time}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  with{" "}
                  {appointment.provider.businessName ||
                    `${appointment.provider.firstName} ${appointment.provider.lastName}`}
                </p>
                <div className="mt-1 flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
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
      {bookings.length > 3 && (
        <div className="pt-4 text-center">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/bookings">View all bookings</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
