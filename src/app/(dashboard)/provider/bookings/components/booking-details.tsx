"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  Scissors,
  CreditCard,
  Info,
  Mail,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "./status-badge";
import { Booking } from "@/lib/api/services/booking";
import { Separator } from "@/components/ui/separator";

interface BookingDetailsProps {
  booking: Booking | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onEditBooking?: () => void;
  embedded?: boolean;
}

export function BookingDetails({
  booking,
  open = true,
  onOpenChange,
  onEditBooking,
  embedded = false,
}: BookingDetailsProps) {
  if (!booking) return null;

  const Wrapper = embedded ? "div" : Dialog;
  const WrapperContent = embedded ? "div" : DialogContent;

  return (
    <Wrapper open={open} onOpenChange={onOpenChange}>
      <WrapperContent className={embedded ? "" : "sm:max-w-[600px]"}>
        {!embedded && (
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Booking #{booking.bookingCode}</span>
              <StatusBadge status={booking.status} />
            </DialogTitle>
          </DialogHeader>
        )}

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-hairsby-orange" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {booking.customer.firstName} {booking.customer.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <p>{booking.customer.phone}</p>
                </div>
              </div>
              {booking.customer.email && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <p>{booking.customer.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Booking Information */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-hairsby-orange" />
              Booking Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p>{format(new Date(booking.date), "PPP")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <p>{booking.time}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p>{booking.totalDuration} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Booking Code</p>
                <p className="font-mono">{booking.bookingCode}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2 text-lg">
              <Scissors className="h-5 w-5 text-hairsby-orange" />
              Services ({booking.services?.length})
            </h3>
            <div className="space-y-3 pl-7">
              {booking.services?.map((service) => (
                <div key={service.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      {service.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {service.description}
                        </p>
                      )}
                    </div>
                    <p className="font-medium text-hairsby-orange">
                      £{service.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between mt-3">
                    <span className="text-sm text-gray-500">
                      {service.duration} min
                    </span>
                    {service.images?.[0] && (
                      <div className="w-16 h-16 rounded-md overflow-hidden">
                        <img
                          src={service.images[0]}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-500">Total Duration</span>
                <span className="font-medium">{booking.totalDuration} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Amount</span>
                <span className="font-medium text-lg">
                  £{booking.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5 text-hairsby-orange" />
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="capitalize font-medium">
                  {booking.paymentStatus}
                </p>
              </div>
              {booking.paymentStatus === "paid" && (
                <div>
                  <p className="text-sm text-gray-500">Amount Paid</p>
                  <p className="font-medium">
                    £{booking.totalAmount.toFixed(2)}
                  </p>
                </div>
              )}
              {booking.escrowStatus && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Escrow Status</p>
                  <p className="capitalize font-medium">
                    {booking.escrowStatus}
                  </p>
                  {booking.escrowReleaseDate && (
                    <p className="text-sm text-gray-500 mt-1">
                      Release date:{" "}
                      {format(new Date(booking.escrowReleaseDate), "PPP")}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-hairsby-orange" />
                  Notes
                </h3>
                <p className="pl-7 text-gray-700 whitespace-pre-line">
                  {booking.notes}
                </p>
              </div>
            </>
          )}
        </div>

        {!embedded && (
          <div className="flex justify-end gap-4 pt-6">
            <Button variant="outline" onClick={() => onOpenChange?.(false)}>
              Close
            </Button>
            {onEditBooking && (
              <Button
                className="bg-hairsby-orange hover:bg-hairsby-orange/80"
                onClick={onEditBooking}
              >
                Edit Booking
              </Button>
            )}
          </div>
        )}
      </WrapperContent>
    </Wrapper>
  );
}
