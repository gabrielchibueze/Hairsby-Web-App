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
  PanelRightDashed,
  BookDownIcon,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "./status-badge";
import { Booking } from "@/lib/api/services/booking";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookingActions } from "@/components/booking/booking-actions";
import Link from "next/link";
import MapPreview from "@/components/map";
import Image from "next/image";
import { useAuth } from "@/lib/contexts/auth.context";

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
  const { user } = useAuth();
  const Wrapper = embedded ? "div" : Dialog;
  const WrapperContent = embedded ? "div" : DialogContent;
  console.log(booking);
  return (
    <Wrapper open={open} onOpenChange={onOpenChange}>
      <WrapperContent
        className={embedded ? "" : "max-w-[400px] sm:mx-0 sm:max-w-[800px]"}
      >
        {!embedded && (
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Booking #{booking.bookingCode}</span>
              <StatusBadge status={booking.status} />
            </DialogTitle>
          </DialogHeader>
        )}
        <div className="flex justify-end mb-4">
          <BookingActions booking={booking} />
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6 md:min-w-[700px]">
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-hairsby-orange" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
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
                    <Link href={`tel:${booking.customer?.phone}`}>
                      <p>{booking.customer.phone}</p>
                    </Link>
                  </div>
                </div>
                {booking.customer.email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Link href={`mailto:${booking.customer?.email}`}>
                        <p>{booking.customer.email}</p>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-hairsby-orange" />
                Booking Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
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
                  <p>
                    {booking.services?.reduce(
                      (sum, s) => sum + Number(s.duration),
                      0
                    )}{" "}
                    minutes
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Code</p>
                  <p className="font-mono">{booking.bookingCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Status</p>
                  <StatusBadge status={booking?.status} />
                </div>
              </div>
            </div>

            <Separator />

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
                        £{Number(service?.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between mt-3">
                      <span className="text-sm text-gray-500">
                        {Number(service?.duration)} min
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
                  <span className="font-medium">
                    {" "}
                    {booking.services.reduce(
                      (sum, s) => sum + Number(s?.duration),
                      0
                    )}{" "}
                    min
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Amount</span>
                  <span className="font-medium text-lg">
                    £{Number(booking.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-hairsby-orange" />
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className="capitalize font-medium">
                    {booking.paymentStatus}
                  </p>
                </div>
                {(booking.paymentStatus === "paid" ||
                  booking.paymentStatus === "partial") && (
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-medium">
                      £{Number(booking.totalAmount).toFixed(2)}
                    </p>
                  </div>
                )}
                {Number(booking?.paidAmount) < Number(booking?.totalAmount) &&
                  booking.paymentStatus !== "pending" && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Balance</p>
                        <p className="capitalize font-medium">
                          {(
                            Number(booking?.totalAmount) -
                            Number(booking?.paidAmount)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </>
                  )}
                {booking.paymentStatus === "refunded" && (
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-medium">
                      £{Number(booking.totalAmount).toFixed(2)}
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
          {user?.id === booking.provider.id && (
            <div className="rounded-lg border p-4 col-span-1 max-w-96">
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
          )}
        </div> */}

        <div
          className={`${user?.id === booking.provider.id ? "flex " : "grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6"}`}
        >
          {/* Main Content */}
          <div
            className={`space-y-6 ${user?.id === booking.provider.id ? "w-full" : ""}`}
          >
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-hairsby-orange" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pl-7">
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
                    <Link href={`tel:${booking.customer?.phone}`}>
                      <p>{booking.customer.phone}</p>
                    </Link>
                  </div>
                </div>
                {booking.customer.email && (
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Link href={`mailto:${booking.customer?.email}`}>
                        <p>{booking.customer.email}</p>
                      </Link>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pl-7">
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
                  <p>
                    {booking.services?.reduce(
                      (sum, s) => sum + Number(s.duration),
                      0
                    )}{" "}
                    minutes
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Code</p>
                  <p className="font-mono">{booking.bookingCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking Status</p>
                  <StatusBadge status={booking?.status} />
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
                        £{Number(service?.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between mt-3">
                      <span className="text-sm text-gray-500">
                        {Number(service?.duration)} min
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
                  <span className="font-medium">
                    {booking.services.reduce(
                      (sum, s) => sum + Number(s?.duration),
                      0
                    )}{" "}
                    min
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Amount</span>
                  <span className="font-medium text-lg">
                    £{Number(booking.totalAmount).toFixed(2)}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pl-7">
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className="capitalize font-medium">
                    {booking.paymentStatus}
                  </p>
                </div>
                {(booking.paymentStatus === "paid" ||
                  booking.paymentStatus === "partial") && (
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-medium">
                      £{Number(booking.totalAmount).toFixed(2)}
                    </p>
                  </div>
                )}
                {Number(booking?.paidAmount) < Number(booking?.totalAmount) &&
                  booking.paymentStatus !== "pending" && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Balance</p>
                        <p className="capitalize font-medium">
                          {(
                            Number(booking?.totalAmount) -
                            Number(booking?.paidAmount)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </>
                  )}
                {booking.paymentStatus === "refunded" && (
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-medium">
                      £{Number(booking.totalAmount).toFixed(2)}
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

          {/* Provider Details - Only shows on lg screens and up */}
          {user?.id !== booking.provider.id ? (
            <div className="lg:sticky lg:top-4 lg:h-fit rounded-lg border p-4">
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
          ) : null}
        </div>

        <div className="flex justify-end gap-4 pt-6">
          {onOpenChange && (
            <Button variant="outline" onClick={() => onOpenChange?.(false)}>
              Close
            </Button>
          )}
          {onEditBooking && user?.id === booking.provider.id && (
            <Button
              className="bg-hairsby-orange hover:bg-hairsby-orange/80"
              onClick={onEditBooking}
            >
              Edit Booking
            </Button>
          )}
        </div>
      </WrapperContent>
    </Wrapper>
  );
}
