"use client";

import { Booking } from "@/lib/api/services/booking";
import { Button } from "@/components/ui/button";
import { Pencil, Eye } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "./status-badge";

interface BookingCardProps {
  booking: Booking;
  onEdit: () => void;
  onViewDetails: () => void;
}

export function BookingCard({
  booking,
  onEdit,
  onViewDetails,
}: BookingCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">
              {format(new Date(booking.date), "MMM d, yyyy")} at {booking.time}
            </h3>
            <p className="text-sm text-gray-600">
              {booking.customer.firstName} {booking.customer.lastName}
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Services: </span>
            {booking.services?.map((s) => s.name).join(", ")}
          </div>
          <div className="text-sm">
            <span className="font-medium">Duration: </span>
            {booking.totalDuration} min
          </div>
          <div className="text-sm">
            <span className="font-medium">Amount: </span>£
            {booking.totalAmount.toFixed(2)}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="border-hairsby-orange text-hairsby-orange hover:bg-amber-50"
          >
            <Eye className="h-4 w-4 mr-2" />
            Details
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
