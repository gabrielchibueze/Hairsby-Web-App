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
  CircleSlashed,
  RemoveFormatting,
  PanelRightDashed,
  TableColumnsSplitIcon,
  BookDashed,
  BookDownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Booking, getBookingDetails } from "@/lib/api/services/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { BookingActions } from "./booking-actions";
import dynamic from "next/dynamic";
import MapPreview from "@/components/map";
import Breadcrumb from "../breadcrumb";
import { useEffect } from "react";
import { FaBalanceScale } from "react-icons/fa";
import { StatusBadge } from "@/components/booking/components/status-badge";

export function BookingDetails({ id }: { id: string }) {
  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingDetails(id),
  });

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
    <div className="">
      {/* Breadcrumb */}
      <Breadcrumb
        breadcrumb={[
          { name: "Dashboard", link: "/dashboard" },
          { name: "My Bookings", link: "/dashboard/bookings" },
          {
            name:
              booking.services[0].name.length > 10
                ? booking.services[0].name.substring(0, 7) + "..."
                : booking.services[0].name,
          },
        ]}
      />
      <div className="flex justify-between items-start py-6">
        <div>
          <h1 className="text-2xl font-bold">
            Booking: #{booking.bookingCode}
          </h1>
          <StatusBadge status={booking?.status} />
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
            {booking.services?.length > 0 &&
              booking.services.map((service: any) => {
                return (
                  <div className="flex items-start gap-4">
                    {service.images.length > 0 && (
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <Image
                          src={service.images[0]}
                          alt={service.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {service.description}
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        {service.duration && (
                          <span className="text-sm">
                            {service.duration} minutes
                          </span>
                        )}
                        <span className="text-sm">
                          £{Number(service.price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                <span className="capitalize">
                  Payment Status: {booking.paymentStatus}
                </span>
              </div>
              {Number(booking?.paidAmount) < Number(booking?.totalAmount) && (
                <>
                  <div className="flex items-center gap-3">
                    <PanelRightDashed className="h-5 w-5 text-gray-500" />
                    <span className="capitalize">
                      Amount Paid: £{booking?.paidAmount}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookDownIcon className="h-5 w-5 text-gray-500" />
                    <span className="capitalize">
                      Balance: £
                      {Number(booking?.totalAmount) -
                        Number(booking?.paidAmount)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-end mb-4">
            <BookingActions booking={booking} />
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
                  <>
                    {" "}
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span>{booking.provider.address}</span>
                    </div>
                    <MapPreview
                      showDirection={true}
                      latitude={booking.provider.latitude}
                      longitude={booking.provider.longitude}
                      markerText={
                        booking.provider.businessName ||
                        `${booking.provider.firstName} ${booking.provider.lastName}`
                      }
                      location={{
                        address: booking.provider.address,
                        city: booking.provider?.city,
                        country: booking.provider?.country,
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
