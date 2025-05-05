"use client";

import { Booking } from "@/lib/api/services/booking";
import { BookingCard } from "./booking-card";
import { useState } from "react";
import { BookingFilters } from "./filters";

interface BookingListProps {
  bookings: Booking[];
  onEditBooking: (booking: Booking) => void;
  onViewDetails: (booking: Booking) => void;
}

export function BookingList({
  bookings,
  onEditBooking,
  onViewDetails,
}: BookingListProps) {
  const [filteredBookings, setFilteredBookings] = useState(bookings);

  return (
    <div className="space-y-4">
      <BookingFilters
        bookings={bookings}
        onFilterChange={setFilteredBookings}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookings?.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onEdit={() => onEditBooking(booking)}
            onViewDetails={() => onViewDetails(booking)}
          />
        ))}
      </div>

      {filteredBookings?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No bookings match your filters</p>
        </div>
      )}
    </div>
  );
}
