// components/provider/dashboard/recent-bookings.tsx
import { Booking } from "@/lib/api/services/booking";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentBookingsProps {
  bookings: Booking[];
  loading?: boolean;
  onEditBooking: (booking: Booking) => void;
  onViewDetails: (booking: Booking) => void;
}

export function RecentBookings({
  bookings,
  loading = false,
  onEditBooking,
  onViewDetails,
}: RecentBookingsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-3 w-[150px]" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-[50px]" />
                <Skeleton className="h-4 w-[50px]" />
              </div>
            </div>
            <Skeleton className="ml-auto h-4 w-[50px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="flex items-center cursor-pointer"
          onClick={() => onViewDetails(booking)}
        >
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {booking.customer.firstName} {booking.customer.lastName}
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {format(new Date(booking.date), "MMM dd, yyyy")} at {booking.time}
            </div>
            <div className="flex gap-2">
              {booking.services.map((service) => (
                <Badge key={service.id} variant="outline">
                  {service.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="ml-auto font-medium">
            £{Number(booking.totalAmount).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
