"use client";

import { motion } from "framer-motion";
import { Booking } from "@/lib/api/services/booking";
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { BookingStatusBadge } from "@/components/booking/components/status-badge";
import { Button } from "@/components/ui/button";

interface RecentBookingsProps {
  bookings: Booking[];
  loading?: boolean;
  onEditBooking?: (booking: Booking) => void;
  onViewDetails?: (booking: Booking) => void;
  account: "dashboard" | "provider" | "admin";
}

export function RecentBookings({
  bookings,
  loading = false,
  onEditBooking,
  onViewDetails,
  account,
}: RecentBookingsProps) {
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

  if (loading) {
    return (
      <div className="divide-y">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center p-4 pl-0">
            <div className="flex-shrink-0">
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <div className="flex items-center">
                  <Skeleton className="h-3 w-16 mr-2" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <Skeleton className="h-3 w-32 mt-1" />
              <div className="mt-1 flex justify-between items-center">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y">
      {bookings.length === 0 ? (
        <div className="py-2 text-center">
          <CalendarIcon className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <h3 className="mt-2 text-sm font-medium text-foreground">
            No upcoming bookings
          </h3>
          <p className="mt-1 text-sm text-muted-foreground/100">
            Book your next beauty service to get started
          </p>
          <div className="mt-6">
            <Button variant="brand">
              <Link href="/services">Book Service</Link>
            </Button>
          </div>
        </div>
      ) : (
        bookings.slice(0, 3).map((booking, index) => (
          <Link key={booking.id} href={`/${account}/bookings/${booking.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center p-4 pl-0 hover:bg-background"
            >
              <div className="flex-shrink-0">
                {
                  statusConfig[booking.status as keyof typeof statusConfig]
                    ?.icon
                }
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    {`Service${booking.services.length > 1 ? "s" : ""}`}:{" "}
                    {booking.services
                      .slice(0, 2)
                      .map((service) => service.name)
                      .join(", ")}
                    {booking.services.length > 2 &&
                      ` +${booking.services.length - 2}`}
                  </h3>
                  <div className="flex items-center">
                    <span className="text-xs text-muted-foreground mr-2">
                      {
                        statusConfig[
                          booking.status as keyof typeof statusConfig
                        ]?.text
                      }
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {booking.time}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  with{" "}
                  {booking.customer.businessName ||
                    `${booking.customer.firstName} ${booking.customer.lastName}`}
                </p>

                <div className="mt-1 flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(booking.date), "EEE, MMM dd")}
                  </p>
                  <p className="text-xs font-medium">
                    £{Number(booking.totalAmount).toFixed(2)}
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
            <Link href={`/${account}/bookings`}>View all appointments</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
