"use client";

import { BookingEvent } from "@/types/general";
import {
  format,
  isSameDay,
  startOfDay,
  differenceInMinutes,
  setHours,
  setMinutes,
} from "date-fns";

interface TimelineDayViewProps {
  date: Date;
  events: BookingEvent[];
  onViewDetails: (booking: BookingEvent) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);
const HOUR_HEIGHT = 60; // Standardized height

export function TimelineDayView({
  date,
  events,
  onViewDetails,
}: TimelineDayViewProps) {
  const dayStart = startOfDay(date);

  // Filter events that fall on the same day
  const dayEvents = events.filter((event) => isSameDay(event.start, date));

  return (
    <div className="flex h-full overflow-y-auto border rounded-lg">
      {/* Time Labels */}
      <div className="w-16 bg-background border-r">
        {hours.map((hour) => {
          const hourLabel = setHours(setMinutes(dayStart, 0), hour);
          return (
            <div
              key={hour}
              style={{ height: `${HOUR_HEIGHT}px` }}
              className="flex items-start justify-end pr-2 text-xs text-muted-foreground"
            >
              {format(hourLabel, "h a")}
            </div>
          );
        })}
      </div>

      {/* Events Area */}
      <div
        className="flex-1 relative"
        style={{ minHeight: `${24 * HOUR_HEIGHT}px` }}
      >
        {/* Hour Lines */}
        {hours.map((hour) => (
          <div
            key={hour}
            className="absolute border-t border-border w-full"
            style={{ top: `${hour * HOUR_HEIGHT}px` }}
          />
        ))}

        {/* Events */}
        {dayEvents.map((event) => {
          const startMinutes =
            event.start.getHours() * 60 + event.start.getMinutes();
          const endMinutes = event.end.getHours() * 60 + event.end.getMinutes();

          if (endMinutes <= startMinutes) return null; // Ignore invalid events

          const top = (startMinutes / 60) * HOUR_HEIGHT;
          const height = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT;

          return (
            <div
              key={event.id}
              className={`absolute left-2 right-2 mx-1 rounded border-l-4 cursor-pointer z-10 overflow-hidden
                ${
                  event.status === "confirmed"
                    ? "border-l-green-500 bg-green-300"
                    : event.status === "completed"
                      ? "border-l-blue-500 bg-blue-300"
                      : event.status === "pending"
                        ? "border-l-amber-500 bg-amber-300"
                        : event.status === "cancelled"
                          ? "border-l-red-500 bg-red-300"
                          : "border-l-purple-500 bg-purple-300"
                }`}
              style={{
                top: `${top}px`,
                height: `${height}px`,
              }}
              onClick={() => onViewDetails(event)}
              title={`${event.status.charAt(0).toLocaleUpperCase() + "" + event.status.slice(1)} booking for ${event.booking.customer.businessName || ` ${event.booking.customer.firstName} ${event.booking.customer.lastName}`}`}
            >
              <div className="px-2 pb-2">
                <div className="text-sm font-medium truncate text-gray-800">
                  {event.title}
                </div>
                <div className="text-xs text-muted">
                  {format(event.start, "h:mm a")} -{" "}
                  {format(event.end, "h:mm a")}
                </div>
                {height > 40 && (
                  <div className="text-xs mt-0 truncate  text-gray-600">
                    {event.booking.customer.businessName ||
                      ` ${event.booking.customer.firstName} ${event.booking.customer.lastName}`}{" "}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
