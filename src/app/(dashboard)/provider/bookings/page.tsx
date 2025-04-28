"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar as CalendarIcon, List, Grid } from "lucide-react";
import { BookingList } from "./components/booking-list";
import { BookingDialog } from "./components/booking-dialog";
import { BookingDetails } from "./components/booking-details";
import { Booking, getBookings } from "@/lib/api/services/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingTable } from "./components/booking-table";
import { CalendarView } from "./components/calendar-view";

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getBookings();
        setBookings(data.bookings);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleNewBooking = () => {
    setSelectedBooking(null);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    // Refresh bookings after successful operation
    setIsDialogOpen(false);
    setIsDetailsOpen(false);
    // You might want to add a refresh function here
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-[500px] w-full rounded-xl" />
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <Button
          onClick={handleNewBooking}
          className="bg-hairsby-orange hover:bg-hairsby-orange/80"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
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

      <BookingDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        booking={selectedBooking}
        providerId={user?.id || " "}
        onSuccess={handleSuccess}
      />

      <BookingDetails
        booking={selectedBooking}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEditBooking={() => {
          setIsDetailsOpen(false);
          setIsDialogOpen(true);
        }}
      />
    </div>
  );
}
