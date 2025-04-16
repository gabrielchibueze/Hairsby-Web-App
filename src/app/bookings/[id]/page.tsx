"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  Calendar,
  CheckCircle,
  MapPin,
  User,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookingDetails } from "@/lib/api/services/booking";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function BookingConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", params.id],
    queryFn: () => getBookingDetails(params.id),
  });

  if (isLoading || !booking) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <div className="grid gap-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <Skeleton className="h-12 w-full mt-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container flex items-center text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/bookings" className="hover:text-gray-900">
            My Bookings
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-medium text-gray-900">
            Booking #{booking.id}
          </span>
        </div>
      </div>

      {/* Booking Confirmation */}
      <section className="py-12">
        <div className="container max-w-3xl">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              Booking Confirmed
            </h1>
            <p className="text-lg text-gray-600">
              Your booking for {booking.service.name} has been confirmed.
            </p>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Booking Details */}
              <div>
                <h2 className="text-xl font-bold mb-4">Booking Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-hairsby-orange mt-0.5" />
                    <div>
                      <h3 className="font-medium">Date & Time</h3>
                      <p className="text-gray-600">
                        {format(new Date(booking.date), "EEEE, MMMM d, yyyy")}
                        <br />
                        {booking.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-hairsby-orange mt-0.5" />
                    <div>
                      <h3 className="font-medium">Duration</h3>
                      <p className="text-gray-600">
                        {booking.service.duration} minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-hairsby-orange mt-0.5" />
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-gray-600">
                        {booking.provider.address}
                        <br />
                        {booking.provider.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service & Provider */}
              <div>
                <h2 className="text-xl font-bold mb-4">Service Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-16 w-16 rounded-md overflow-hidden">
                      <Image
                        src={booking.service.images[0]}
                        alt={booking.service.name}
                        width={64}
                        height={64}
                        className="object-cover h-full w-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{booking.service.name}</h3>
                      <p className="text-gray-600">
                        £{booking.service.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    {booking.provider.photo && (
                      <div className="h-16 w-16 rounded-full overflow-hidden">
                        <Image
                          src={booking.provider.photo}
                          alt={booking.provider.businessName || "Provider"}
                          width={64}
                          height={64}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">
                        {booking.provider.businessName || "Professional"}
                      </h3>
                      <p className="text-gray-600">
                        {booking.provider.firstName} {booking.provider.lastName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold mb-4">Payment Information</h2>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.paymentStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.paymentStatus === "paid" ? "Paid" : "Pending"}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-bold">
                  £{booking.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/bookings")}
              >
                View All Bookings
              </Button>
              <Button className="flex-1 bg-hairsby-orange hover:bg-hairsby-orange/80">
                Add to Calendar
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
