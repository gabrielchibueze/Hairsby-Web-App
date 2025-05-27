"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, CheckCircle, XCircle, UserCheck } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Booking, getBookings } from "@/lib/api/services/booking";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Constants
const STATUS_ICONS = {
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  confirmed: <CheckCircle className="h-4 w-4 text-green-500" />,
  cancelled: <XCircle className="h-4 w-4 text-red-500" />,
  completed: <UserCheck className="h-4 w-4 text-blue-500" />,
  "no-show": <XCircle className="h-4 w-4 text-red-500" />,
};

const EmptyState = ({ status }: { status?: string }) => (
  <div className="py-8 text-center">
    <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
    <h3 className="mt-2 text-sm font-medium text-foreground">
      No bookings found
    </h3>
    <p className="mt-1 text-sm text-muted-foreground">
      {status ? `You have no ${status} bookings` : "You have no bookings yet"}
    </p>
    <div className="mt-6">
      <Button asChild className="bg-hairsby-orange hover:bg-amber-500">
        <a href="/services">Book a Service</a>
      </Button>
    </div>
  </div>
);

const BookingCard = ({ booking }: { booking: Booking }) => {
  const hasServiceImage = booking.services?.[0]?.images?.[0];

  return (
    <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
      <div className="flex gap-4">
        {hasServiceImage && (
          <div className="hidden sm:block relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={hasServiceImage}
              alt={booking.services[0].name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80px"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-medium truncate">
                {booking.services?.map((service) => service.name).join(", ")}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                with{" "}
                {booking.provider.businessName ||
                  `${booking.provider.firstName} ${booking.provider.lastName}`}
              </p>
            </div>

            <Badge
              variant="outline"
              className="flex items-center gap-1 flex-shrink-0"
            >
              {STATUS_ICONS[booking.status]}
              {booking.status}
            </Badge>
          </div>

          <div className="flex justify-between items-end mt-3">
            <div className="flex gap-2 flex-col sm:gap-4 sm:flex-row">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                {format(new Date(booking.date), "PPP")}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                {booking.time}
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-medium">
                £{Number(booking.totalAmount).toFixed(2)}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 hover:bg-hairsby-orange/40"
                asChild
              >
                <Link href={`/dashboard/bookings/${booking.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="h-24 w-full rounded-lg" />
    ))}
  </div>
);

export function BookingList({ status }: { status?: string }) {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings", status],
    queryFn: () => getBookings({ status }),
  });

  if (isLoading) return <LoadingSkeleton />;
  if (!bookings?.length) return <EmptyState status={status} />;

  return (
    <div className="space-y-4">
      {bookings.map((booking: Booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
