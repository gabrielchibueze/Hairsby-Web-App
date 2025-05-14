import { Booking } from "@/lib/api/services/booking";
import { format } from "date-fns";
import { CalendarIcon, ChevronRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
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
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="p-3 hover:bg-[#0a0e17]/5 transition-colors border-[#0a0e17]/20"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Skeleton className="h-10 w-10 rounded-full bg-[#0a0e17]/10" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-3/4 sm:w-40 bg-[#0a0e17]/10" />
                  <Skeleton className="h-3 w-1/2 sm:w-48 bg-[#0a0e17]/10" />
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
                <Skeleton className="h-6 w-20 bg-[#0a0e17]/10" />
                <Skeleton className="h-4 w-12 bg-[#0a0e17]/10" />
                <ChevronRightIcon className="h-4 w-4 text-[#0a0e17]/50" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.slice(0, 3).map((booking) => (
        <Card
          key={booking.id}
          className="p-3 transition-colors cursor-pointer border-gray-300"
        >
          <Link href={`/${account}/orders/${booking.id}`}>
            <div className="flex flex-col items-start  justify-between gap-3">
              <div className="flex items-center gap-3 w-full">
                <div className="bg-[#F9A000]/10 p-2 rounded-full">
                  <CalendarIcon className="h-5 w-5 text-[#F9A000]" />
                </div>
                <div className="min-w-0 w-full">
                  <div className="flex flex-row justify-between items-center content-between ">
                    {account === "dashboard" ? (
                      <p className="text-sm text-gray-500">
                        with{" "}
                        {booking.provider.businessName ||
                          `${booking.provider.firstName} ${booking.provider.lastName}`}
                      </p>
                    ) : (
                      <p className="font-medium text-[#0a0e17] truncate">
                        {booking.customer?.firstName}{" "}
                        {booking.customer?.lastName}
                      </p>
                    )}
                    <div className="flex justify-end">
                      <BookingStatusBadge status={booking.status} />
                    </div>{" "}
                  </div>
                  <p className="text-sm text-[#0a0e17]/70 flex items-center">
                    <CalendarIcon className="mr-1 h-3 w-3 text-[#0a0e17]/50" />
                    {format(new Date(booking.date), "MMM dd, yyyy")} at{" "}
                    {booking.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full justify-end ">
                <div className="flex gap-1 max-w-[120px]overflow-x-auto">
                  {booking.services.slice(0, 2).map((service) => (
                    <Badge
                      key={service.id}
                      variant="outline"
                      className="px-2 py-1 text-xs whitespace-nowrap border-[#0a0e17]/20 text-[#0a0e17]"
                    >
                      {service.name}
                    </Badge>
                  ))}
                  {booking.services.length > 2 && (
                    <Badge
                      variant="outline"
                      className="px-2 py-1 text-xs border-[#0a0e17]/20 text-[#0a0e17]"
                    >
                      +{booking.services.length - 2}
                    </Badge>
                  )}
                </div>
                <span className="font-medium text-sm min-w-[60px] text-right text-[#0a0e17]">
                  £{Number(booking.totalAmount).toFixed(2)}
                </span>
                <ChevronRightIcon className="h-4 w-4 text-[#0a0e17]/50" />
              </div>
            </div>
          </Link>
        </Card>
      ))}
      {bookings.length > 3 && (
        <div className="p-4 text-center">
          <Button variant="ghost" asChild>
            <Link href={`/${account}/bookings`}>View all appointments</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
