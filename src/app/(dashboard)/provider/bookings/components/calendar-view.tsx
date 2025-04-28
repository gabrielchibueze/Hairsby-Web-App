"use client";

import { useState, useMemo } from "react";
import { addHours, format, isSameDay } from "date-fns";
import { Booking } from "@/lib/api/services/booking";
import { Calendar } from "@/components/ui/calendar";
import type { DayContentProps } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  // Process bookings into calendar events
  const events = useMemo(() => {
    return bookings?.map((booking) => {
      const date = new Date(booking.date);
      const [hours, minutes] = booking.time.split(":")?.map(Number);
      date.setHours(hours, minutes);

      const endDate = addHours(date, booking.totalDuration / 60);

      return {
        id: booking.id,
        title: booking.services?.map((s) => s.name).join(", "),
        start: date,
        end: endDate,
        booking,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
      };
    });
  }, [bookings]);

  // Get events for the selected day
  const dayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return events?.filter((event) => isSameDay(event.start, selectedDay));
  }, [selectedDay, events]);

  // Date cell renderer with proper typing
  const DateCell = (props: DayContentProps) => {
    const day = props.date;
    const dayEvents = events?.filter((event) => isSameDay(event.start, day));
    const hasEvents = dayEvents?.length > 0;

    // Count by status for the day
    const statusCounts = dayEvents?.reduce(
      (acc, event) => {
        acc[event.status] = (acc[event.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div
            className={`w-full h-full flex flex-col items-center justify-start p-1 relative 
              ${hasEvents ? "cursor-pointer hover:bg-gray-50 rounded" : ""}`}
          >
            <span
              className={`
              ${isSameDay(day, new Date()) ? "bg-hairsby-orange text-white rounded-full w-6 h-6 flex items-center justify-center" : ""}
            `}
            >
              {format(day, "d")}
            </span>

            {/* Status indicators */}
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
              {dayEvents?.map((event) => (
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
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-xs text-gray-600">
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
              ))}
            </div>
          </PopoverContent>
        )}
      </Popover>
    );
  };

  return (
    <div className="space-y-4">
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const prevMonth = new Date(date);
              prevMonth.setMonth(prevMonth.getMonth() - 1);
              setDate(prevMonth);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-medium">{format(date, "MMMM yyyy")}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const nextMonth = new Date(date);
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              setDate(nextMonth);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setDate(new Date());
            setSelectedDay(new Date());
          }}
        >
          Today
        </Button>
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Calendar
            mode="single"
            month={date}
            onMonthChange={setDate}
            selected={selectedDay}
            onSelect={setSelectedDay}
            className="rounded-md border p-2"
            components={{
              DayContent: DateCell,
            }}
          />
        </div>

        {/* Day Events */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg">
            {selectedDay
              ? format(selectedDay, "MMMM d, yyyy")
              : "Select a date"}
          </h3>

          {dayEvents?.length > 0 ? (
            <div className="space-y-3">
              {dayEvents?.map((event) => (
                <div
                  key={event.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    event.status === "confirmed"
                      ? "border-green-200"
                      : event.status === "completed"
                        ? "border-blue-200"
                        : event.status === "pending"
                          ? "border-amber-200"
                          : event.status === "cancelled"
                            ? "border-red-200"
                            : "border-purple-200"
                  }`}
                  onClick={() => onViewDetails(event.booking)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="text-sm text-gray-600 mt-1">
                        {format(event.start, "h:mm a")} -{" "}
                        {format(event.end, "h:mm a")}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          event.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : event.paymentStatus === "partial"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {event.paymentStatus}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full mt-1 ${
                          event.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : event.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : event.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : event.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm">
                      {event.booking.customer.firstName}{" "}
                      {event.booking.customer.lastName}
                    </div>
                    <div className="text-sm font-medium">
                      £{event.booking.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {selectedDay
                ? "No bookings for this day"
                : "Select a date to view bookings"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
