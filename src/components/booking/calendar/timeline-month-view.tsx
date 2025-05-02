"use client";

import { BookingEvent } from "@/types/general";
import {
  format,
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
} from "date-fns";

interface TimelineMonthViewProps {
  date: Date;
  events: BookingEvent[];
  onViewDetails: (booking: BookingEvent) => void;
}

export function TimelineMonthView({
  date,
  events,
  onViewDetails,
}: TimelineMonthViewProps) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group events by day
  const eventsByDay = days.reduce(
    (acc, day) => {
      acc[format(day, "yyyy-MM-dd")] = events.filter((event) =>
        isSameDay(event.start, day)
      );
      return acc;
    },
    {} as Record<string, BookingEvent[]>
  );

  return (
    <div className="grid grid-cols-7 gap-1">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="text-center font-medium text-sm p-2">
          {day}
        </div>
      ))}

      {Array.from({ length: monthStart.getDay() }).map((_, i) => (
        <div key={`empty-start-${i}`} className="h-24 border border-gray-100" />
      ))}

      {days.map((day) => {
        const dayEvents = eventsByDay[format(day, "yyyy-MM-dd")] || [];

        return (
          <div
            key={day.toString()}
            className={`h-24 border p-1 overflow-hidden ${isSameMonth(day, date) ? "border-gray-200" : "border-gray-100 bg-gray-50"}`}
          >
            <div
              className={`text-right ${isSameDay(day, new Date()) ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center ml-auto" : ""}`}
            >
              {format(day, "d")}
            </div>
            <div className="overflow-y-auto h-16">
              {dayEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className={`text-xs p-1 my-1 rounded truncate cursor-pointer ${
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
                  onClick={() => onViewDetails(event)}
                >
                  {format(event.start, "h:mm a")} {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
      })}

      {Array.from({ length: 6 - monthEnd.getDay() }).map((_, i) => (
        <div key={`empty-end-${i}`} className="h-24 border border-gray-100" />
      ))}
    </div>
  );
}
