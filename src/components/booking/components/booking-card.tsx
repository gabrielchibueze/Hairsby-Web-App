"use client";

import { Booking } from "@/lib/api/services/booking";
import { Button } from "@/components/ui/button";
import { Pencil, Eye } from "lucide-react";
import { format } from "date-fns";
import { BookingStatusBadge } from "./status-badge";
import { useRouter } from "next/navigation";
import formatDuration from "@/lib/utils/minute-to-hour";
import { formatCurrency } from "@/lib/utils";

interface BookingCardProps {
  booking: Booking;
  onEdit?: () => void;
  onViewDetails?: () => void;
  inDetails?: boolean;
}

export function BookingCard({
  booking,
  onEdit,
  onViewDetails,
  inDetails = false,
}: BookingCardProps) {
  const router = useRouter();
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 space-y-2">
        <section className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm">#{booking.bookingCode}</h3>
            <BookingStatusBadge status={booking.status} />
          </div>
          <div className="text-sm flex justify-between gap-4">
            <span className="font-medium ">Time</span>
            <span className="font-medium text-sm text-muted-foreground">
              {format(new Date(booking.date), "MMM d, yyyy")} at {booking.time}
            </span>
          </div>
          <div className="text-sm flex justify-between gap-4">
            <span className="font-medium ">Customer </span>
            <span className="font-medium text-muted-foreground ">
              {booking.customer?.firstName} {booking.customer?.lastName}
            </span>{" "}
          </div>
        </section>
        <div>
          <h2 className="text-sm font-bold mb-2">Services</h2>
          <table className="w-full text-xs border-border">
            <thead className="">
              <tr>
                <th className="px-3 py-2 text-left border">#</th>
                <th className="px-3 py-2 text-left border">Name</th>
                <th className="px-3 py-2 text-left border">Duration</th>
                <th className="px-3 py-2 text-left border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {booking.items?.map((service, index) => (
                <tr key={index} className="border-t">
                  <td className="px-3 py-2 border">{index + 1}</td>
                  <td className="px-3 py-2 border font-medium">
                    {service.name}
                  </td>
                  <td className="px-3 py-2 border">
                    {formatDuration(service?.duration)}
                  </td>
                  <td className="px-3 py-2 border">
                    {formatCurrency(
                      Number(service.price).toFixed(2),
                      service?.currency!
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {booking.items?.length > 1 && (
          <section className="space-y-2">
            <div className="text-sm flex justify-between gap-4">
              <span className="font-medium ">Total Duration</span>
              <span className="font-medium text-sm text-muted-foreground">
                {formatDuration(booking.totalDuration)}
              </span>
            </div>
            <div className="text-sm flex justify-between gap-4">
              <span className="font-medium ">Total Amount </span>
              <span className="font-medium text-muted-foreground ">
                {Number(booking.totalAmount).toFixed(2)}
              </span>{" "}
            </div>
          </section>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              inDetails
                ? router.push(`/provider/bookings/${booking.id}`)
                : onViewDetails?.()
            }
          >
            <Eye className="h-4 w-4 mr-2" />
            Details
          </Button>
          {booking.status !== "completed" &&
            booking.status !== "cancelled" &&
            !inDetails && (
              <Button
                variant="brand"
                size="sm"
                onClick={() =>
                  inDetails
                    ? router.push(`/provider/bookings/${booking.id}/edit`)
                    : onEdit?.()
                }
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
