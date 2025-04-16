"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  CreditCard,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Booking, getBookingDetails } from "@/lib/api/services/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { BookingActions } from "./booking-actions";

export function BookingDetails({ id }: { id: string }) {
  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingDetails(id),
  });
  console.log(booking);
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-8 text-center">
        <XCircle className="mx-auto h-8 w-8 text-red-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Booking not found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          The booking you're looking for doesn't exist
        </p>
        <div className="mt-6">
          <Button asChild className="bg-hairsby-orange hover:bg-amber-500">
            <Link href="/bookings">View All Bookings</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Booking #{booking.id}</h1>
          <Badge variant="outline" className="mt-2">
            {booking.status}
          </Badge>
        </div>
        <span className="text-xl font-bold">
          £{Number(booking.totalAmount).toFixed(2)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Service Details */}
          <div className="rounded-lg border p-4">
            <h2 className="font-medium mb-4">Service Details</h2>
            {booking.service?.length > 0 &&
              booking.service.map((booking: any) => (
                <div className="flex items-start gap-4">
                  {booking.images.length > 0 && (
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <Image
                        src={booking.images[0]}
                        alt={booking.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{booking.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {booking.description}
                    </p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-sm">
                        {booking.totalDuration} minutes
                      </span>
                      <span className="text-sm">
                        £{Number(booking.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Appointment Details */}
          <div className="rounded-lg border p-4">
            <h2 className="font-medium mb-4">Appointment Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>
                  {format(new Date(booking.date), "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <span className="capitalize">{booking.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Details */}
        <div className="rounded-lg border p-4">
          <h2 className="font-medium mb-4">Provider Details</h2>
          <div className="flex items-start gap-4">
            {booking.provider.photo && (
              <div className="relative h-16 w-16 rounded-full overflow-hidden">
                <Image
                  src={booking.provider.photo}
                  alt={
                    booking.provider.businessName ||
                    `${booking.provider.firstName} ${booking.provider.lastName}`
                  }
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-medium">
                {booking.provider.businessName ||
                  `${booking.provider.firstName} ${booking.provider.lastName}`}
              </h3>
              <div className="mt-3 space-y-2">
                {booking.provider.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{booking.provider.phone}</span>
                  </div>
                )}
                {booking.provider.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span>{booking.provider.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingActions booking={booking} />
    </div>
  );
}
