"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getBookingDetails } from "@/lib/api/services/booking";
import { BookingDetails } from "../../../../../components/booking/components/booking-details";
import Link from "next/link";
import { useState } from "react";
import Breadcrumb from "@/components/general/breadcrumb";
import Spinner from "@/components/general/spinner";

export default function AppointmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { toast } = useToast();
  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", params.id],
    queryFn: () => getBookingDetails(params.id),
  });
  const [isEditing, setIsEditing] = useState<boolean | false>(false);
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[90vh]">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <Link href="/dashboard/bookings">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Button>
      </Link>
      {booking ? (
        <BookingDetails
          booking={booking}
          embedded
          // onOpenChange={handleBackToList}
          // onEditBooking={() => setIsEditing(true)}
        />
      ) : (
        <div className="h-96 flex justify-center items-center flex-col gap-4">
          <h2 className="font-bold">Booking not found</h2>

          <p>Discover service professionals and experts around you</p>
          <Link href="/services">
            <Button variant="brand">Discover Services</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
