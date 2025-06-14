"use client";

import { Booking } from "@/lib/api/services/booking";
import { BookingCard } from "./booking-card";
import { useState } from "react";
import { BookingFilters } from "./filters";
import { Calendar } from "lucide-react";

interface BookingListProps {
  bookings: Booking[];
  onEditBooking?: (booking: Booking) => void;
  onViewDetails?: (booking: Booking) => void;
  inDetails?: boolean;
}

export function BookingList({
  bookings,
  onEditBooking,
  onViewDetails,
  inDetails = false,
}: BookingListProps) {
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(bookings);

  return (
    <div className="space-y-4">
      <BookingFilters
        bookings={bookings}
        onFilterChange={setFilteredBookings}
      />

      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings?.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onEdit={() => onEditBooking?.(booking)}
              onViewDetails={() => onViewDetails?.(booking)}
              inDetails={inDetails}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 justify-self-center w-full">
          <Calendar className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">No bookings found</p>
          <p className="text-muted-foreground text-sm">
            No bookings match your search. Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
}
