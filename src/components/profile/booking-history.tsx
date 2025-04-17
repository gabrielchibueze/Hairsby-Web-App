"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Scissors,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getBookingHistory } from "@/lib/api/accounts/profile";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Booking } from "@/lib/api/services/booking";

export function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBookings() {
      try {
        const { bookings } = await getBookingHistory();
        setBookings(bookings);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load booking history",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="success">Confirmed</Badge>;
      case "completed":
        return <Badge>Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card className="border-hairsby-orange/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-6 w-6" />
          Booking History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No bookings yet</h3>
            <p className="text-sm text-muted-foreground">
              Your upcoming and past bookings will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        {`Service${booking.services?.length > 1 ? "s" : ""}`}:{" "}
                        {booking.services?.length > 0 &&
                          booking.services
                            .map((service) => service.name)
                            .join(", ")}
                      </h3>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>
                          {booking.provider.businessName ||
                            `${booking.provider.firstName} ${booking.provider.lastName}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(booking.date), "PPP")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.provider.address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="font-medium">
                      ${Number(booking.totalAmount).toFixed(2)}
                    </div>
                    {booking.status === "confirmed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-hairsby-orange text-hairsby-orange"
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
