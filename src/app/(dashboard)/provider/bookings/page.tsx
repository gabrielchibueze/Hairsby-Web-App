"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Calendar as CalendarIcon,
  List,
  Grid,
  ArrowLeft,
} from "lucide-react";
import { BookingList } from "@/components/booking/components/booking-list";
import { BookingForm } from "@/components/booking/components/booking-form";
import { BookingDetails } from "@/components/booking/components/booking-details";
import { Booking } from "@/lib/api/services/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingTable } from "@/components/booking/components/booking-table";
import { CalendarView } from "@/components/booking/components/calendar-view";
import { getProviderBookings } from "@/lib/api/accounts/provider";
import { BookingFilters } from "@/components/booking/components/filters";
import Spinner from "@/components/general/spinner";

type ViewMode = "list" | "form" | "details";

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeTab, setActiveTab] = useState("calendar");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getProviderBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (typeof window !== undefined) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (viewMode === "list") {
      fetchBookings();
    }
  }, [viewMode]);

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewMode("form");
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setViewMode("details");
  };

  const handleNewBooking = () => {
    setSelectedBooking(null);
    setViewMode("form");
  };

  const handleSuccess = () => {
    // Refresh bookings after successful operation
    setViewMode("list");
    // You might want to add a refresh function here
    const fetchBookings = async () => {
      const data = await getProviderBookings();
      setBookings(data);
    };
    fetchBookings();
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  // if (loading) {
  //   return (
  //     <div className="space-y-4">
  //       <Skeleton className="h-10 w-[200px]" />
  //       <div className="grid gap-4 md:grid-cols-2">
  //         <Skeleton className="h-[400px] w-full rounded-xl" />
  //         <Skeleton className="h-[400px] w-full rounded-xl" />
  //       </div>
  //     </div>
  //   );
  // }
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[90vh]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {viewMode === "list" ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
            <Button onClick={handleNewBooking} variant="brand">
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="flex items-center w-full sm:w-fit justify-between sm:justify-start">
              <TabsTrigger value="calendar">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="mr-2 h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="grid">
                <Grid className="mr-2 h-4 w-4" />
                Grid
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-4">
              <CalendarView
                bookings={bookings}
                onEditBooking={handleEditBooking}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              <BookingTable
                bookings={bookings}
                onEditBooking={handleEditBooking}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>

            <TabsContent value="grid" className="space-y-4">
              <BookingList
                bookings={bookings}
                onEditBooking={handleEditBooking}
                onViewDetails={handleViewDetails}
              />
            </TabsContent>
          </Tabs>
        </>
      ) : viewMode === "form" ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={handleBackToList} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">
            {selectedBooking ? "Edit Booking" : "New Booking"}
          </h1>

          <BookingForm
            booking={selectedBooking}
            providerId={user?.id || " "}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onSuccess={handleSuccess}
            onCancel={handleBackToList}
          />
        </div>
      ) : viewMode === "details" ? (
        <div className="space-y-4">
          <Button variant="ghost" onClick={handleBackToList} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>

          <BookingDetails
            booking={selectedBooking}
            embedded
            onOpenChange={handleBackToList}
            onEditBooking={() => setViewMode("form")}
          />
        </div>
      ) : null}
    </div>
  );
}
