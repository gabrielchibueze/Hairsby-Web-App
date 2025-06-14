"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/use-toast";
import { getBookingDetails, Booking } from "@/lib/api/services/booking";
import { BookingDetails } from "../../../../../components/booking/components/booking-details";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookingForm } from "@/components/booking/components/booking-form";
import Spinner from "@/components/general/spinner";
import { useRouter } from "next/navigation";
type ViewMode = "editBooking" | "bookingDetails";

export default function AppointmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("bookingDetails");
  const [booking, setBookings] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getBookingDetails(params.id);
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch booking data:", err);
        setError("Failed to load booking data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (viewMode === "bookingDetails") {
      fetchDashboardData();
    }
  }, [viewMode]);

  const handleEditBooking = () => {
    setViewMode("editBooking");
  };

  const handleViewBookingDetails = () => {
    setViewMode("bookingDetails");
  };

  const handleSuccess = () => {
    setViewMode("bookingDetails");
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[90vh]">
        <Spinner />
      </div>
    );
  }

  function handleBack() {
    router.back();
  }
  return (
    <div>
      {viewMode === "bookingDetails" ? (
        <div className="space-y-4">
          <Button variant="ghost" className="mb-4" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {booking ? (
            <BookingDetails
              booking={booking}
              embedded
              // onOpenChange={handleBackToBookingDetails}
              onEditBooking={handleEditBooking}
            />
          ) : (
            <div className="h-96 flex justify-center items-center flex-col gap-4">
              <h2 className="font-bold">Booking not found</h2>

              <p>Process new service bookings to get started</p>
              <Link href="/provider/bookings">
                <Button variant="brand">New Booking</Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={handleViewBookingDetails}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Close
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">Edit Booking</h1>

          <BookingForm
            booking={booking}
            providerId={booking?.provider?.id || " "}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onSuccess={handleSuccess}
            onCancel={handleViewBookingDetails}
          />
        </div>
      )}
    </div>
  );
}
