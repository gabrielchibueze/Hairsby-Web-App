"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, CheckCircle, XCircle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Booking, getBookings } from "@/lib/api/services/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const statusIcons = {
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  confirmed: <CheckCircle className="h-4 w-4 text-green-500" />,
  cancelled: <XCircle className="h-4 w-4 text-red-500" />,
  completed: <UserCheck className="h-4 w-4 text-blue-500" />,
  "no-show": <XCircle className="h-4 w-4 text-red-500" />,
};

export function BookingList({ status }: { status?: string }) {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings", status],
    queryFn: () => getBookings({ status }),
  });
  console.log(bookings);
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings?.length === 0 ? (
        <div className="py-8 text-center">
          <Calendar className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No bookings found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {status
              ? `You have no ${status} bookings`
              : "You have no bookings yet"}
          </p>
          <div className="mt-6">
            <Button asChild className="bg-hairsby-orange hover:bg-amber-500">
              <Link href="/services">Book a Service</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {bookings?.map((booking: Booking) => (
            <div
              key={booking.id}
              className="rounded-lg border p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {" "}
                      {`Service${booking.services?.length > 1 ? "s" : ""}`}:{" "}
                      {booking.services?.length > 0 &&
                        booking.services
                          .map((service) => service.name)
                          .join(", ")}
                    </h3>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {statusIcons[booking?.status]}
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    with{" "}
                    {booking.provider.businessName ||
                      `${booking.provider.firstName} ${booking.provider.lastName}`}
                  </p>
                  <div className="flex justify-between gap-4">
                    <div
                      className="mt-2 flex flex-col items-end gap-2 sm:flex-row sm:gap-4 sm:items-end
                    "
                    >
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(booking.date), "PPP")}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {booking.time}
                      </div>
                    </div>

                    <div className="flex flex-col items-end ">
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
          ))}
        </>
      )}
    </div>
  );
}
