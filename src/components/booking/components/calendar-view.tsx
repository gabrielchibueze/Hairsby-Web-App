"use client";

import { useState, useMemo } from "react";
import { addHours, format, isSameDay } from "date-fns";
import { Booking } from "@/lib/api/services/booking";
import type { DayContentProps } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookingEvent } from "@/types/general";
import { TimelineView } from "@/components/booking/calendar/timeline-view";

interface CalendarViewProps {
  bookings: Booking[];
  onEditBooking: (booking: Booking) => void;
  onViewDetails: (booking: Booking) => void;
}

export function CalendarView({
  bookings,
  onEditBooking,
  onViewDetails,
}: CalendarViewProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("day");

  // Process bookings into calendar events
  const events = useMemo(() => {
    return bookings
      ?.map((booking) => {
        try {
          const bookingDate = new Date(booking.date);
          if (isNaN(bookingDate.getTime())) {
            console.error("Invalid booking date:", booking.date);
            return null;
          }

          const [hours, minutes] = booking.time.split(":").map(Number);
          if (isNaN(hours) || isNaN(minutes)) {
            console.error("Invalid booking time:", booking.time);
            return null;
          }

          const startDate = new Date(bookingDate);
          startDate.setHours(hours, minutes, 0, 0);

          const endDate = addHours(
            startDate,
            booking.services.reduce((sum, s) => sum + Number(s.duration), 0) /
              60
          );

          return {
            id: booking.id,
            title:
              booking.services?.map((s) => s.name).join(", ") || "No services",
            start: startDate,
            end: endDate,
            booking,
            status: booking.status || "unknown",
            paymentStatus: booking.paymentStatus || "unknown",
          };
        } catch (error) {
          console.error("Error processing booking:", booking, error);
          return null;
        }
      })
      .filter(Boolean) as BookingEvent[];
  }, [bookings]);

  const dayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return events?.filter(
      (event) => event && isSameDay(event.start, selectedDay)
    );
  }, [selectedDay, events]);

  const DateCell = (props: DayContentProps) => {
    const day = props.date;
    const dayEvents = events?.filter(
      (event) => event && isSameDay(event.start, day)
    );
    const hasEvents = dayEvents?.length > 0;

    const statusCounts = dayEvents?.reduce(
      (acc, event) => {
        if (event) {
          acc[event.status] = (acc[event.status] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={`w-full h-full flex flex-col items-center justify-start p-1 relative 
              ${hasEvents ? "cursor-pointer hover:bg-background rounded" : ""}`}
          >
            <span
              className={`${
                isSameDay(day, new Date())
                  ? "bg-hairsby-orange text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                  : ""
              }`}
            >
              {format(day, "d")}
            </span>

            {hasEvents && (
              <div className="flex flex-wrap justify-center gap-1 mt-1 w-full">
                {Object.entries(statusCounts)?.map(([status, count]) => (
                  <div
                    key={status}
                    className={`h-1 w-1 rounded-full ${
                      status === "confirmed"
                        ? "bg-green-500"
                        : status === "completed"
                          ? "bg-blue-500"
                          : status === "pending"
                            ? "bg-amber-500"
                            : status === "cancelled"
                              ? "bg-red-500"
                              : "bg-purple-500"
                    }`}
                    title={`${count} ${status} booking(s)`}
                  />
                ))}
              </div>
            )}
          </div>
        </PopoverTrigger>

        {hasEvents && (
          <PopoverContent className="w-64 p-2">
            <div className="text-sm font-medium mb-2">
              {format(day, "MMMM d, yyyy")}
            </div>
            <div className="space-y-2">
              {dayEvents?.map(
                (event) =>
                  event && (
                    <div
                      key={event.id}
                      className={`p-2 rounded border-l-4 cursor-pointer ${
                        event.status === "confirmed"
                          ? "border-l-green-500 bg-green-50"
                          : event.status === "completed"
                            ? "border-l-blue-500 bg-blue-50"
                            : event.status === "pending"
                              ? "border-l-amber-500 bg-amber-50"
                              : event.status === "cancelled"
                                ? "border-l-red-500 bg-red-50"
                                : "border-l-purple-500 bg-purple-50"
                      }`}
                      onClick={() => onViewDetails(event.booking)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium truncate">
                            {event.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(event.start, "h:mm a")} -{" "}
                            {format(event.end, "h:mm a")}
                          </div>
                        </div>
                        <div
                          className={`text-xs px-1 rounded ${
                            event.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : event.paymentStatus === "partial"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {event.paymentStatus}
                        </div>
                      </div>
                      <div className="text-xs mt-1">
                        {event.booking.customer.firstName}{" "}
                        {event.booking.customer.lastName}
                      </div>
                    </div>
                  )
              )}
            </div>
          </PopoverContent>
        )}
      </Popover>
    );
  };

  const navigateToPreviousPeriod = () => {
    const newDate = new Date(date);
    if (view === "day") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setDate(newDate);
  };

  const navigateToNextPeriod = () => {
    const newDate = new Date(date);
    if (view === "day") {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setDate(newDate);
  };

  const getCurrentPeriodLabel = () => {
    if (view === "day") {
      return format(date, "MMMM d, yyyy");
    } else if (view === "week") {
      const start = new Date(date);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      if (start.getMonth() === end.getMonth()) {
        return `${format(start, "MMMM d")} - ${format(end, "d, yyyy")}`;
      } else if (start.getFullYear() === end.getFullYear()) {
        return `${format(start, "MMMM d")} - ${format(end, "MMMM d, yyyy")}`;
      } else {
        return `${format(start, "MMMM d, yyyy")} - ${format(end, "MMMM d, yyyy")}`;
      }
    } else {
      return format(date, "MMMM yyyy");
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Calendar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToPreviousPeriod}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-medium">{getCurrentPeriodLabel()}</h3>
          <Button variant="outline" size="sm" onClick={navigateToNextPeriod}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("day")}
          >
            Day
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("week")}
          >
            Week
          </Button>
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("month")}
          >
            Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              setDate(today);
              setSelectedDay(today);
            }}
          >
            Today
          </Button>
        </div>
      </div>

      {/* Calendar/Timeline View */}
      <div className="flex-1 overflow-hidden">
        <TimelineView
          view={view}
          date={date}
          events={events}
          onViewDetails={(event) => onViewDetails(event.booking)}
        />
      </div>
    </div>
  );
}
